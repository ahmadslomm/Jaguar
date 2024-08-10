import { User } from "../schema/user.schema";
import LevelInfo from "../schema/levelInfo.schema";
import { StatusInfo } from "../schema/statusInfo.schema";
import { UserTokenInfo } from "../schema/userTokenInfo.schema";
import { MultiTapLevel } from "../schema/multiTapLevel.schema";
import { EnergyTankLevel } from "../schema/energyTankLevel.schema";
import { EnergyChargingLevel } from "../schema/energyChargingLevel.schema";
import jwt from "jsonwebtoken";
import { TTelegramUserInfo, TUserModel } from "../utils/Types";
import { ObjectId, Types } from "mongoose";
import { ReferralClaim } from "../schema/referralClaim.schema";
import { SocialMediaTrek } from "../schema/socialMediaTrek.schema";
import { ReferralTrek } from "../schema/referralTrek.schema";
import { LeagueTrek } from "../schema/leagueTrek.schema";
import { literal, Op } from "sequelize";

// ******************* Register User For Server-side Bot Request******************* //

// export const registerUser = async (userInfo: TTelegramUserInfo) => {
//   try {
//     const { first_name, last_name, id } = userInfo;

//     const user = await User.findOneAndUpdate(
//       { telegramId: id },
//       { telegramId: id, firstName: first_name, lastName: last_name },
//       { upsert: true, new: true }
//     );

//     if (user) {
//       return true;
//     }

//     return false;
//   } catch (error) {
//     return false;
//   }
// };

// ******************* Create User With Status and different Level ID *******************
export const createUser = async (userInfo: TUserModel) => {
  try {
    const { firstName, lastName, telegramId, referralCode } = userInfo;

    //   const levelInfo = {levelName :'LEVEL-1'};
    const levelInfo = await LevelInfo.findOne({
      where: { levelName: "LEVEL-1" },
    });

    //   const multiTapLevel = {levelName :'LEVEL-1'}
    const multiTapLevel = await MultiTapLevel.findOne({
      where: { levelName: "LEVEL-1" },
      attributes: ["id", "levelName"],
    });

    //   const energyTankLevel ={levelName :  'LEVEL-1', tankCapacity : 500}
    const energyTankLevel = await EnergyTankLevel.findOne({
      where: { levelName: "LEVEL-1" },
      attributes: ["id", "levelName", "tankCapacity"],
    });

    //   const energyChargingLevel = {levelName :'LEVEL-1'}
    const energyChargingLevel = await EnergyChargingLevel.findOne({
      where: { levelName: "LEVEL-1" },
      attributes: ["id", "levelName"],
    });

    const statusInfo = await StatusInfo.findOne({ where: { minRequired: 0 } });

    const referredByUser = referralCode
      ? await User.findOne({ where: { referralCode: referralCode } })
      : null;

    const referralCodeToStore: string | undefined = generateReferralCode(
      telegramId!.toString()
    );

    const createdUser = await User.create({
      telegramId,
      firstName,
      lastName,
      referralCode: referralCodeToStore,
      referredBy: referredByUser ? referredByUser.id : null,
    });

    if (referredByUser) {
      await ReferralClaim.create({
        referrerId: referredByUser.id,
        referredUserId: createdUser.id,
        claimed: true,
        referralAmount: process.env.SIGNUP_REFERRAL_AMOUNT,
        referralStatus: "CLAIMED",
      });

      await UserTokenInfo.update(
        {
          currentBalance: literal(
            `currentBalance + ${process.env.SIGNUP_REFERRAL_AMOUNT}`
          ),
          turnOverBalance: literal(
            `turnOverBalance + ${process.env.SIGNUP_REFERRAL_AMOUNT}`
          ),
        },
        { where: { userId: referredByUser?.id } }
      );

      const totalCount = await ReferralClaim.count({
        where: { referrerId: referredByUser.id, claimed: true },
      });

      //Update the refferel count of the referred user
      updateRefferelCount(referredByUser?.id, totalCount);
    }

    // Create UserTokenInfo if user creation was successful
    if (createdUser && statusInfo) {
      const createUserTokenInfoData: any = {
        userId: createdUser.id, // Ensure this is correctly assigned
        statusId: statusInfo?.id, // Ensure this is correctly assigned
        totalTankCapacity: energyTankLevel?.tankCapacity, // Ensure this is correctly assigned
        multiTapLevel: multiTapLevel?.levelName, // Ensure this is correctly assigned
        energyTankLevel: energyTankLevel?.levelName, // Ensure this is correctly assigned
        energyChargingLevel: energyChargingLevel?.levelName, // Ensure this is correctly assigned
        tankUpdateTime: new Date(), // Current timestamp
        // ...(referredByUser && {
        //   turnOverBalance: process.env.SIGNUP_REFERRAL_AMOUNT,
        // }),
        // ...(referredByUser && {
        //   currentBalance: process.env.SIGNUP_REFERRAL_AMOUNT,
        // }),
      };
      const userTOkenInfoCreated = await UserTokenInfo.create(
        createUserTokenInfoData
      );
      const socialMediaTrek = await SocialMediaTrek.create({
        userId: createdUser?.id,
      });
      const referralTrek = await ReferralTrek.create({
        userId: createdUser.id,
      });
      const leagueTrek = await LeagueTrek.create({ userId: createdUser.id });
    }
  } catch (error) {
    console.error(
      "Getting error for creating user with level and status:",
      error
    );
    throw error;
  }
};

// ******************* Calculation for energy tank balance ******************* //
export const calculateEnergyTankBalance = async (
  userId: string | undefined
) => {
  try {
    console.log("userID: " + userId);
    const userTokenInfo = await UserTokenInfo.findOne({
      where: {
        userId,
      },
      raw: true,
    });

    const getEnergyTankLevel = await EnergyTankLevel.findOne({
      where: {
        levelName: userTokenInfo?.energyTankLevel,
      },
    });

    const getEnergyChargingLevel: any = await EnergyChargingLevel.findOne({
      where: {
        levelName: userTokenInfo?.energyChargingLevel,
      },
    });

    const currentTime = new Date();

    const lastUpdateTime = userTokenInfo?.tankUpdateTime;

    let updateFiled: any = { tankUpdateTime: currentTime };

    // console.log("0000000000", userTokenInfo?.totalTankCapacity, userTokenInfo?.currentTankBalance)
    console.log(
      "Getting the last update time for ",
      lastUpdateTime,
      currentTime
    );
    if (lastUpdateTime) {
      const lastUpdateDate = new Date(lastUpdateTime).setHours(0, 0, 0, 0);
      const currentDate = new Date(currentTime).setHours(0, 0, 0, 0);

      //   console.log("Getting dates : ", lastUpdateDate, currentDate )

      lastUpdateDate !== currentDate &&
        (updateFiled["dailyChargingBooster"] = 7);
      lastUpdateDate !== currentDate &&
        (updateFiled["dailyTappingBoosters"] = 7);

      // console.log("userTOkenInfooooo", userTokenInfo);

      //check to update the current balance
      if (
        userTokenInfo?.totalTankCapacity > userTokenInfo?.currentTankBalance
      ) {
        const timeDifference =
          currentTime.getTime() - lastUpdateTime?.getTime();

        const timeDifferenceInSeconds = Math.floor(timeDifference / 1000);
        // console.log("Getting the second difference in seconds for ",timeDifferenceInSeconds)
        const tankBalanceToAdd =
          userTokenInfo?.currentTankBalance +
          timeDifferenceInSeconds * getEnergyChargingLevel?.chargingSpeed;
        // console.log("2222", tankBalanceToAdd)
        const updatedTankBalance =
          tankBalanceToAdd >= userTokenInfo?.totalTankCapacity
            ? userTokenInfo?.totalTankCapacity
            : tankBalanceToAdd;

        updateFiled["currentTankBalance"] = updatedTankBalance;
      }

      // console.log("3333333", updatedTankBalance)

      // console.log("4444444", updateUserTokenInfo)
    }
    // console.log(
    //   "Getting the updatedFiled ********************************",
    //   updateFiled
    // );
    const userTokenInfoForUpdate = await UserTokenInfo.findOne({
      where: { userId },
    });

    if (userTokenInfo) {
      await userTokenInfoForUpdate?.update(updateFiled);
      await userTokenInfoForUpdate?.reload();
      //   console.log('Updated UserTokenInfo:', userTokenInfo);
      return;
    }
  } catch (error) {
    console.log("Getting error for calculating energy tank balance : ", error);
    throw error;
  }
};

//******************* Generate Refferal Code *******************
function generateReferralCode(telegramId: string) {
  const chars = "ABCDEFGHIJKLMNPQRSTUVWXYZ"; // Omitted O for better distinction
  const digits = "0123456789";
  let referralCode = "";

  for (let i = 0; i < telegramId.length; i++) {
    if (i % 2 === 0) {
      referralCode += chars[parseInt(telegramId[i], 10)];
    } else {
      referralCode += digits[parseInt(telegramId[i], 10)];
    }
  }

  return referralCode ? referralCode : undefined;
}

//******************* Get Social Media Trek Info ******************* //
export async function getSocialMediaTrekInfo(userId: string | undefined) {
  const checkAvlSocialMediaTrek = await SocialMediaTrek.findOne({
    where: { userId },
  });

  const socialMediaTasks = [
    {
      type: "FollowonTwitter",
      follow: checkAvlSocialMediaTrek?.followTwitter,
      claimed: checkAvlSocialMediaTrek?.followTwitterClaimed,
    },
    {
      type: "JoinTwitter",
      follow: checkAvlSocialMediaTrek?.joinTwitter,
      claimed: checkAvlSocialMediaTrek?.joinTwitterClaimed,
    },
    {
      type: "FollowonInstagram",
      follow: checkAvlSocialMediaTrek?.followInstagram,
      claimed: checkAvlSocialMediaTrek?.followInstagramClaimed,
    },
    {
      type: "JoinInstagram",
      follow: checkAvlSocialMediaTrek?.joinInstagram,
      claimed: checkAvlSocialMediaTrek?.joinInstagramClaimed,
    },
    {
      type: "FollowonYouTube",
      follow: checkAvlSocialMediaTrek?.followYouTube,
      claimed: checkAvlSocialMediaTrek?.followYouTubeClaimed,
    },
    {
      type: "JoinYouTube",
      follow: checkAvlSocialMediaTrek?.joinYouTube,
      claimed: checkAvlSocialMediaTrek?.joinYouTubeClaimed,
    },
    {
      type: "FollowonTelegram",
      follow: checkAvlSocialMediaTrek?.followTelegram,
      claimed: checkAvlSocialMediaTrek?.followTelegramClaimed,
    },
    {
      type: "JoinTelegram",
      follow: checkAvlSocialMediaTrek?.joinTelegram,
      claimed: checkAvlSocialMediaTrek?.joinTelegramClaimed,
    },
  ];

  return socialMediaTasks.map((task) => ({
    type: task.type,
    coin: checkAvlSocialMediaTrek?.amount || 100000,
    follow: task.follow,
    ...(!task.follow &&
      !task.claimed && { link: process.env.SOCIALMEDIA_LINK }),
    ...(task.follow && { claimed: task.claimed }),
  }));
}

//******************* Get Referral Trek Info ******************* //
export async function getReferralTrekInfo(userId: string | undefined) {
  const checkAvlReferralTrek = await ReferralTrek.findOne({
    where: { userId },
  });

  const response = {
    refer: [
      {
        type: 1,
        coin: checkAvlReferralTrek?.amountFor1Friends,
        claim: checkAvlReferralTrek?.readyToClaimFor1Friends,
        claimed: checkAvlReferralTrek?.claimedFor1Friends,
      },
      {
        type: 5,
        coin: checkAvlReferralTrek?.amountFor5Friends,
        claim: checkAvlReferralTrek?.readyToClaimFor5Friends,
        claimed: checkAvlReferralTrek?.claimedFor5Friends,
      },
      {
        type: 10,
        coin: checkAvlReferralTrek?.amountFor10Friends,
        claim: checkAvlReferralTrek?.readyToClaimFor10Friends,
        claimed: checkAvlReferralTrek?.claimedFor10Friends,
      },
      {
        type: 20,
        coin: checkAvlReferralTrek?.amountFor20Friends,
        claim: checkAvlReferralTrek?.readyToClaimFor20Friends,
        claimed: checkAvlReferralTrek?.claimedFor20Friends,
      },
      {
        type: 50,
        coin: checkAvlReferralTrek?.amountFor50Friends,
        claim: checkAvlReferralTrek?.readyToClaimFor50Friends,
        claimed: checkAvlReferralTrek?.claimedFor50Friends,
      },
      {
        type: 100,
        coin: checkAvlReferralTrek?.amountFor100Friends,
        claim: checkAvlReferralTrek?.readyToClaimFor100Friends,
        claimed: checkAvlReferralTrek?.claimedFor100Friends,
      },
    ],
  };

  return response;
}

//******************* Get League Trek Info ******************* //
export async function getLeagueTrekInfo(userId: string, statusId: string) {
  // Fetch the league trek info for the given user
  const checkAvlLeagueTrek: any = await LeagueTrek.findOne({
    where: { userId },
  });

  const checkAvlStatusInfo = await StatusInfo.findOne({
    where: { id: statusId },
    attributes: ["status"],
  });

  if (!checkAvlLeagueTrek) {
    // Handle case where no data is found
    return { League: [] };
  }

  // Define the levels and their respective amount fields
  const levels = [
    {
      type: "Beginner",
      amountField: "amountForBeginner",
      readyToClaimField: "readyToClaimForBeginner",
      claimedField: "claimedForBeginner",
      minRequired: 0,
    },
    {
      type: "Player",
      amountField: "amountForPlayer",
      readyToClaimField: "readyToClaimForPlayer",
      claimedField: "claimedForPlayer",
      minRequired: 10000,
    },
    {
      type: "Fan",
      amountField: "amountForFan",
      readyToClaimField: "readyToClaimForFan",
      claimedField: "claimedForFan",
      minRequired: 50000,
    },
    {
      type: "Gamer",
      amountField: "amountForGamer",
      readyToClaimField: "readyToClaimForGamer",
      claimedField: "claimedForGamer",
      minRequired: 100000,
    },
    {
      type: "Expert",
      amountField: "amountForExpert",
      readyToClaimField: "readyToClaimForExpert",
      claimedField: "claimedForExpert",
      minRequired: 500000,
    },
  ];

  // Generate the response in the desired format
  const response = {
    League: levels.map((level: any) => ({
      type: level.type,
      level: level.type, // Assuming level field is the same as type
      coin: checkAvlLeagueTrek[level.amountField], // Format number with commas
      claim: checkAvlLeagueTrek[level.readyToClaimField],
      claimed: checkAvlLeagueTrek[level.claimedField],
      currentLevel: level.type === checkAvlStatusInfo?.status ? true : false, // Example: Setting currentLevel based on some condition
      minRequired: level.minRequired,
    })),
  };

  return response;
}

//******************* Update Social Media Trek Info ******************* //
export async function updateSocialTrek(data: any) {
  const { userId, type, action } = data;

  const socialTrekList = [
    {
      type: "FollowonTwitter",
      action: "follow",
      fieldName: "followTwitter",
    },
    {
      type: "FollowonTwitter",
      action: "claim",
      fieldName: "followTwitterClaimed",
      amount: 100000,
    },
    {
      type: "JoinTwitter",
      action: "follow",
      fieldName: "joinTwitter",
    },
    {
      type: "JoinTwitter",
      action: "claim",
      fieldName: "joinTwitterClaimed",
      amount: 100000,
    },
    {
      type: "FollowonInstagram",
      action: "follow",
      fieldName: "followInstagram",
    },
    {
      type: "FollowonInstagram",
      action: "claim",
      fieldName: "followInstagramClaimed",
      amount: 100000,
    },
    {
      type: "JoinInstagram",
      action: "follow",
      fieldName: "joinInstagram",
    },
    {
      type: "JoinInstagram",
      action: "claim",
      fieldName: "joinInstagramClaimed",
      amount: 100000,
    },
    {
      type: "FollowonYouTube",
      action: "follow",
      fieldName: "followYouTube",
    },
    {
      type: "FollowonYouTube",
      action: "claim",
      fieldName: "followYouTubeClaimed",
      amount: 100000,
    },
    {
      type: "JoinYouTube",
      action: "follow",
      fieldName: "joinYouTube",
    },
    {
      type: "JoinYouTube",
      action: "claim",
      fieldName: "joinYouTubeClaimed",
      amount: 100000,
    },
    {
      type: "FollowonTelegram",
      action: "follow",
      fieldName: "followTelegram",
    },
    {
      type: "FollowonTelegram",
      action: "claim",
      fieldName: "followTelegramClaimed",
      amount: 100000,
    },
    {
      type: "JoinTelegram",
      action: "follow",
      fieldName: "joinTelegram",
    },
    {
      type: "JoinTelegram",
      action: "claim",
      fieldName: "joinTelegramClaimed",
      amount: 100000,
    },
  ];

  const field = socialTrekList.filter(
    (item) => item.type === type && item.action === action
  )[0];

  if (!field) {
    return null;
    throw new Error("Invalid type or action");
  }

  // Determine the field name to update
  const fieldName = field.fieldName;

  const amount = field.amount;

  const updatedSocialMediaTrek = await SocialMediaTrek.update(
    { [fieldName]: true }, // Assuming you want to set the field to true
    { where: { userId } }
  );

  if (action == "claim") {
    await UserTokenInfo.update(
      {
        currentBalance: literal(`currentBalance + ${amount}`),
        turnOverBalance: literal(`turnOverBalance + ${amount}`),
      },
      { where: { userId } }
    );
  }

  return updatedSocialMediaTrek;
}

//******************* Update Referral Trek Info ******************* //
export async function updateReferTrek(data: any) {
  const { userId, type, action } = data;
  const referTrekList = [
    {
      type: 1,
      action: "claim",
      fieldName: "claimedFor1Friends",
      amount: 10000,
    },
    {
      type: 5,
      action: "claim",
      fieldName: "claimedFor5Friends",
      amount: 500000,
    },
    {
      type: 10,
      action: "claim",
      fieldName: "claimedFor10Friends",
      amount: 1000000,
    },
    {
      type: 20,
      action: "claim",
      fieldName: "claimedFor20Friends",
      amount: 2000000,
    },
    {
      type: 50,
      action: "claim",
      fieldName: "claimedFor50Friends",
      amount: 5000000,
    },
    {
      type: 100,
      action: "claim",
      fieldName: "claimedFor100Friends",
      amount: 10000000,
    },
  ];

  const field = referTrekList.filter(
    (item) => item.type === type && item.action === action
  )[0];

  console.log("field ********************************", field);

  if (!field) {
    return null;
  }

  const fieldName = field.fieldName;
  const amount = field.amount;

  const updatedReferralTrek = await ReferralTrek.update(
    { [fieldName]: true }, // Assuming you want to set the field to true
    { where: { userId } }
  );

  await UserTokenInfo.update(
    {
      currentBalance: literal(`currentBalance + ${amount}`),
      turnOverBalance: literal(`turnOverBalance + ${amount}`),
    },
    { where: { userId } }
  );

  return updatedReferralTrek;
}

//******************* Update League Trek Info ******************* //
export async function updateLeagueTrek(data: any) {
  const { userId, type, action } = data;

  const leagueTrekList = [
    {
      type: "Beginner",
      action: "claim",
      fieldName: "claimedForBeginner",
      amount: 2000,
    },
    {
      type: "Player",
      action: "claim",
      fieldName: "claimedForPlayer",
      amount: 5000,
    },
    { type: "Fan", action: "claim", fieldName: "claimedForFan", amount: 10000 },
    {
      type: "Gamer",
      action: "claim",
      fieldName: "claimedForGamer",
      amount: 50000,
    },
    {
      type: "Expert",
      action: "claim",
      fieldName: "claimedForExpert",
      amount: 100000,
    },
  ];

  const field = leagueTrekList.filter(
    (item) => item.type === type && item.action === action
  )[0];

  if (!field) {
    return null;
  }

  const fieldName = field.fieldName;
  const amount = field.amount;

  const updatedLeagueTrek = await LeagueTrek.update(
    { [fieldName]: true }, // Assuming you want to set the field to true
    { where: { userId } }
  );

  await UserTokenInfo.update(
    {
      currentBalance: literal(`currentBalance + ${amount}`),
      turnOverBalance: literal(`turnOverBalance + ${amount}`),
    },
    { where: { userId } }
  );

  return updatedLeagueTrek;
}

//******************* Update Refferel Count ******************* //
async function updateRefferelCount(userId: string, totalReferral: number) {
  const referTrekList = [
    { type: 1, fieldName: "readyToClaimFor1Friends", amount: 10000 },
    { type: 5, fieldName: "readyToClaimFor5Friends", amount: 500000 },
    { type: 10, fieldName: "readyToClaimFor10Friends", amount: 1000000 },
    { type: 20, fieldName: "readyToClaimFor20Friends", amount: 2000000 },
    { type: 50, fieldName: "readyToClaimFor50Friends", amount: 5000000 },
    { type: 100, fieldName: "readyToClaimFor100Friends", amount: 10000000 },
  ];

  const referralTrek = await ReferralTrek.findOne({
    where: { userId: userId },
  });

  if (!referralTrek) {
    throw new Error(`ReferralTrek record not found for userId: ${userId}`);
  }

  // Update fields based on the totalReferral count
  for (const { type, fieldName } of referTrekList) {
    if (totalReferral >= type) {
      (referralTrek as any)[fieldName] = true; // Dynamically set field value to true
    }
  }

  // Save the updated record
  await referralTrek.save();
}

//******************* Check league/ status level and update it ******************* //
export async function updateLeagueLevel(telegramId: string) {
  const checkAvlUser = await User.findOne({
    where: { telegramId },
  });

  if (!checkAvlUser) {
    return null;
  }
  const checkAvlUserTokenInfo = await UserTokenInfo.findOne({
    where: { userId: checkAvlUser?.id },
    attributes: ["currentBalance", "statusId", "turnOverBalance"],
  });

  console.log("Balance info: ", checkAvlUserTokenInfo);

  const checkAvlRequiredStatsInfo = await StatusInfo.findOne({
    where: {
      minRequired: {
        [Op.lte]: checkAvlUserTokenInfo?.turnOverBalance,
      },
      maxRequired: {
        [Op.gte]: checkAvlUserTokenInfo?.turnOverBalance,
      },
    },
  });

  console.log("heck ccccc", checkAvlRequiredStatsInfo);

  const updateStatus = await UserTokenInfo.update(
    { statusId: checkAvlRequiredStatsInfo?.id },
    { where: { userId: checkAvlUser.id } }
  );

  const leagueTrekList = [
    { type: "Beginner", fieldName: "readyToClaimForBeginner", amount: 2000 },
    { type: "Player", fieldName: "readyToClaimForPlayer", amount: 5000 },
    { type: "Fan", fieldName: "readyToClaimForFan", amount: 10000 },
    { type: "Gamer", fieldName: "readyToClaimForGamer", amount: 50000 },
    { type: "Expert", fieldName: "readyToClaimForExpert", amount: 100000 },
  ];

  const field = leagueTrekList.filter(
    (item) => item.type === checkAvlRequiredStatsInfo?.status
  )[0];

  if (!field) {
    return null;
  }

  const fieldName = field.fieldName;

  const updatedLeagueTrek = await LeagueTrek.update(
    { [fieldName]: true },
    { where: { userId: checkAvlUser.id } }
  );
}
