import { User } from "../schema/user.schema";
import LevelInfo from "../schema/levelInfo.schema";
import { StatusInfo } from "../schema/statusInfo.schema";
import { UserTokenInfo } from "../schema/userTokenInfo.schema";
import { UserFlipTokenInfo } from "../schema/userFlipTokenInfo.schema";
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

    // console.log("Getting into the create user functions...", userInfo);

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

    console.log("Created new user: ", createUser)

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
        currentTankBalance : 500
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

      const userFlipTokenInformation = await UserFlipTokenInfo.create({ userId: createdUser.id });
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
    const userTokenInfo: any = await UserTokenInfo.findOne({
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

    let lastUpdateTime = userTokenInfo?.tankUpdateTime;

    let updateFiled: any = { tankUpdateTime: currentTime };

    // console.log("0000000000", userTokenInfo?.totalTankCapacity, userTokenInfo?.currentTankBalance)
    console.log(
      "Getting the last update time for ",
      new Date(),
      lastUpdateTime,
      currentTime
    );
    if (lastUpdateTime) {
      const lastUpdateDate = new Date(lastUpdateTime).setHours(0, 0, 0, 0);
      const currentDate = new Date(currentTime).setHours(0, 0, 0, 0);

      if (typeof lastUpdateTime === "string") {
        lastUpdateTime = new Date(lastUpdateTime);
      }

      //   console.log("Getting dates : ", lastUpdateDate, currentDate )

      lastUpdateDate !== currentDate &&
        (updateFiled["dailyChargingBooster"] = 7);
      lastUpdateDate !== currentDate &&
        (updateFiled["dailyTappingBoosters"] = 7);
      lastUpdateDate !== currentDate &&
        (updateFiled["dailyGammingLimit"] = 5);

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
export const updateTankCapacity = async (userId: string | undefined) => {
  try {
    const checkAvlUserTokenInfo = await UserTokenInfo.findOne({
      where: { userId: userId },
      raw: true,
    });
    const checkAvlEnergyTanKLevel = await EnergyTankLevel.findOne({
      where: { levelName: checkAvlUserTokenInfo?.energyTankLevel },
    });
    const updatedTankCapacity = await UserTokenInfo.update(
      { currentTankBalance: checkAvlEnergyTanKLevel?.tankCapacity },
      { where: { userId } }
    );
    return updatedTankCapacity;
  } catch (error) {}
};

//******************* Get Social Media Trek Info ******************* //
export async function getSocialMediaTrekInfo(userId: string | undefined) {
  const checkAvlSocialMediaTrek = await SocialMediaTrek.findOne({
    where: { userId },
    raw: true
  });

  // console.log("Get socialMediaTrekInfo*****************************", checkAvlSocialMediaTrek);

  const socialMediaTasks = [
    {
      type: "FollowonTwitter",
      name: "Follow on Twitter",
      follow: checkAvlSocialMediaTrek?.followTwitter,
      claimed: checkAvlSocialMediaTrek?.followTwitterClaimed,
      link : process.env.TWITTER_LINK
    },
    // {
    //   type: "JoinTwitter",
    //   follow: checkAvlSocialMediaTrek?.joinTwitter,
    //   claimed: checkAvlSocialMediaTrek?.joinTwitterClaimed,
    // },
    {
      type: "FollowonInstagram",
      name: "Follow on Instagram",
      follow: checkAvlSocialMediaTrek?.followInstagram,
      claimed: checkAvlSocialMediaTrek?.followInstagramClaimed,
      link: process.env.INSTAGRAME_LINK
    },
    // {
    //   type: "JoinInstagram",
    //   follow: checkAvlSocialMediaTrek?.joinInstagram,
    //   claimed: checkAvlSocialMediaTrek?.joinInstagramClaimed,
    // },
    // {
    //   type: "FollowonYouTube",
    //   follow: checkAvlSocialMediaTrek?.followYouTube,
    //   claimed: checkAvlSocialMediaTrek?.followYouTubeClaimed,
    // },
    {
      type: "JoinYouTube",
      name: "Join YouTube",
      follow: checkAvlSocialMediaTrek?.joinYouTube,
      claimed: checkAvlSocialMediaTrek?.joinYouTubeClaimed,
      link: process.env.YOUTUBE_LINK
    },
    // {
    //   type: "FollowonTelegram",
    //   follow: checkAvlSocialMediaTrek?.followTelegram,
    //   claimed: checkAvlSocialMediaTrek?.followTelegramClaimed,
    // },
    {
      type: "JoinTelegram",
      name: "Join Telegram",
      follow: checkAvlSocialMediaTrek?.joinTelegram,
      claimed: checkAvlSocialMediaTrek?.joinTelegramClaimed,
      link: process.env.TELEGRAME_LINK
    },
  ];

  return socialMediaTasks.map((task) => ({
    type: task.type,
    name : task.name,
    coin: checkAvlSocialMediaTrek?.amount || 100000,
    follow: task.follow,
    ...(!task.follow &&
      !task.claimed && { link: task.link }),
    ...(task.follow && { claimed: task.claimed }),
  }));
}

//******************* Get Referral Trek Info ******************* //
export async function getReferralTrekInfo(userId: string | undefined) {
  const checkAvlReferralTrek = await ReferralTrek.findOne({
    where: { userId },
    raw : true
  });

  const response = {
    refer: [
      (!checkAvlReferralTrek?.claimedFor1Friends && {
        type: 1,
        coin: checkAvlReferralTrek?.amountFor1Friends,
        claim: checkAvlReferralTrek?.readyToClaimFor1Friends,
        claimed: checkAvlReferralTrek?.claimedFor1Friends,
      }),
      (!checkAvlReferralTrek?.claimedFor5Friends && {
        type: 5,
        coin: checkAvlReferralTrek?.amountFor5Friends,
        claim: checkAvlReferralTrek?.readyToClaimFor5Friends,
        claimed: checkAvlReferralTrek?.claimedFor5Friends,
      }),
      (!checkAvlReferralTrek?.claimedFor10Friends && {
        type: 10,
        coin: checkAvlReferralTrek?.amountFor10Friends,
        claim: checkAvlReferralTrek?.readyToClaimFor10Friends,
        claimed: checkAvlReferralTrek?.claimedFor10Friends,
      }),
      (!checkAvlReferralTrek?.claimedFor20Friends &&{
        type: 20,
        coin: checkAvlReferralTrek?.amountFor20Friends,
        claim: checkAvlReferralTrek?.readyToClaimFor20Friends,
        claimed: checkAvlReferralTrek?.claimedFor20Friends,
      }),
      (!checkAvlReferralTrek?.claimedFor50Friends &&{
        type: 50,
        coin: checkAvlReferralTrek?.amountFor50Friends,
        claim: checkAvlReferralTrek?.readyToClaimFor50Friends,
        claimed: checkAvlReferralTrek?.claimedFor50Friends,
      }),
      (!checkAvlReferralTrek?.claimedFor100Friends &&{
        type: 100,
        coin: checkAvlReferralTrek?.amountFor100Friends,
        claim: checkAvlReferralTrek?.readyToClaimFor100Friends,
        claimed: checkAvlReferralTrek?.claimedFor100Friends,
      }),
    ]
    .filter(Boolean)
    // .slice(0, 5)
  };



  // console.log("Geting response for referralTrekInfo:",response) 

  return response;
}

//******************* Get League Trek Info ******************* //
export async function getLeagueTrekInfo(userId: string, statusId: string, turnOverBalance : number | string) {
  // Fetch the league trek info for the given user
  const checkAvlLeagueTrek: any = await LeagueTrek.findOne({
    where: { userId },
    raw : true
  });

  const checkAvlStatusInfo = await StatusInfo.findOne({
    where: { id: statusId },
    attributes: ["status"],
    raw : true
  });

  console.log("Getting the leagugeInfoooooooooooooooo", checkAvlStatusInfo)

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
      maxRequired:10000
    },
    {
      type: "Player",
      amountField: "amountForPlayer",
      readyToClaimField: "readyToClaimForPlayer",
      claimedField: "claimedForPlayer",
      minRequired: 10000,
      maxRequired: 50000
    },
    {
      type: "Fan",
      amountField: "amountForFan",
      readyToClaimField: "readyToClaimForFan",
      claimedField: "claimedForFan",
      minRequired: 50000,
      maxRequired: 100000
    },
    {
      type: "Gamer",
      amountField: "amountForGamer",
      readyToClaimField: "readyToClaimForGamer",
      claimedField: "claimedForGamer",
      minRequired: 100000,
      maxRequired: 500000
    },
    {
      type: "Expert",
      amountField: "amountForExpert",
      readyToClaimField: "readyToClaimForExpert",
      claimedField: "claimedForExpert",
      minRequired: 500000,
      maxRequired: 1000000
    },
    {
      type: "Master",
      amountField: "amountForMaster",
      readyToClaimField: "readyToClaimForMaster",
      claimedField: "claimedForMaster",
      minRequired: 1000000,
      maxRequired: 10000000
    },
    {
      type: "Pro",
      amountField: "amountForPro",
      readyToClaimField: "readyToClaimForPro",
      claimedField: "claimedForPro",
      minRequired: 10000000,
      maxRequired: 50000000
    },
    {
      type: "Veteran",
      amountField: "amountForVeteran",
      readyToClaimField: "readyToClaimForVeteran",
      claimedField: "claimedForVeteran",
      minRequired: 50000000,
      maxRequired: 100000000
    },
    {
      type: "Champion",
      amountField: "amountForChampion",
      readyToClaimField: "readyToClaimForChampion",
      claimedField: "claimedForChampion",
      minRequired: 100000000,
      maxRequired: 500000000
    },
    {
      type: "Degen",
      amountField: "amountForDegen",
      readyToClaimField: "readyToClaimForDegen",
      claimedField: "claimedForDegen",
      minRequired: 500000000,
      maxRequired: +Infinity
    },
  ];

  let currentFlagSet = false;

  const response = {
    League: levels.map((level: any) => {
      var isCurrentLevel = level.type === checkAvlStatusInfo?.status;
      var currentFlag = currentFlagSet ? true : false;
      // const manageClaimFalgForNextLevel = false
      console.log("getting current eteration;", level.type, checkAvlStatusInfo?.status)
      // If the current level is found and currentFlag hasn't been set yet
      if(!checkAvlLeagueTrek[level.claimedField]) {
        const claim = turnOverBalance >= level.maxRequired ? true : checkAvlLeagueTrek[level.readyToClaimField];
        console.log("Claim:", claim,'status',isCurrentLevel, currentFlag, checkAvlStatusInfo?.status,currentFlag,  'type:', level.type, turnOverBalance, level.maxRequired)
        if (isCurrentLevel && !currentFlagSet) {
          console.log("Level name 111:", level.type)
          currentFlagSet = true; // Set the flag to true for the next record
          // isCurrentLevel = false;
          return {
            type: level.type,
            level: level.type,
            coin: checkAvlLeagueTrek[level.amountField],
            // claim: checkAvlLeagueTrek[level.readyToClaimField],
            claim,
            claimed: checkAvlLeagueTrek[level.claimedField],
            currentLevel: false,
            // currentFlag: false, // No flag for the current level
            minRequired: level.minRequired,
            maxRequired: level.maxRequired,
          };
        };

        if (!isCurrentLevel && currentFlagSet) {
          console.log("Level name 222:", level.type)
          currentFlagSet = false; // Set the flag to true for the next record
          return {
            type: level.type,
            level: level.type,
            coin: checkAvlLeagueTrek[level.amountField],
            // claim: checkAvlLeagueTrek[level.readyToClaimField],
            claim,
            claimed: checkAvlLeagueTrek[level.claimedField],
            currentLevel: true,
            // currentFlag: false, // No flag for the current level
            minRequired: level.minRequired,
            maxRequired: level.maxRequired,
          };
        }
  
        // For all other records
        console.log("Level name 333:", level.type)
        return {
          type: level.type,
          level: level.type,
          coin: checkAvlLeagueTrek[level.amountField],
          // claim: checkAvlLeagueTrek[level.readyToClaimField],
          claim,
          claimed: checkAvlLeagueTrek[level.claimedField],
          currentLevel: false,
          // currentFlag, // The next record after currentLevel will have currentFlag true
          minRequired: level.minRequired,
          maxRequired: level.maxRequired,
        };
      }
      else if(checkAvlLeagueTrek[level.claimedField] && isCurrentLevel ) {
        currentFlagSet = true
      };

      return null
    }).filter(Boolean)
    // .slice(0,5)
  };

  // console.log("Getting response in getLeagueInfo", response)

  return response;
}

//******************* Update Social Media Trek Info ******************* //
export async function updateSocialTrek(data: any) {
  const { userId, type, action, telegramId } = data;
  console.log("dataaaaa", data)
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
    const currentTime = new Date();
    const userTokenInfo = await UserTokenInfo.findOne({where :{ userId : userId}});
    userTokenInfo && await userTokenInfo.increment('currentBalance', { by: amount });
    userTokenInfo && await userTokenInfo.increment('turnOverBalance', { by: amount });
    userTokenInfo && await userTokenInfo.update({ tankUpdateTime: currentTime });
    userTokenInfo &&  await userTokenInfo.reload();
    await updateLeagueLevel(telegramId);
    // const temp = await UserTokenInfo.update(
    //   {
    //     currentBalance: literal(`currentBalance + ${amount}`),
    //     turnOverBalance: literal(`turnOverBalance + ${amount}`),
    //   },
    //   { where: { userId } }
    // );
    // console.log("Getting temp*********", temp);
  }

  return updatedSocialMediaTrek;
}

//******************* Update Referral Trek Info ******************* //
export async function updateReferTrek(data: any) {
  const { userId, type, action, telegramId } = data;
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

  const currentTime = new Date();
  const userTokenInfo = await UserTokenInfo.findOne({where :{ userId : userId}});
  userTokenInfo && await userTokenInfo.increment('currentBalance', { by: amount });
  userTokenInfo && await userTokenInfo.increment('turnOverBalance', { by: amount });
  userTokenInfo && await userTokenInfo.update({ tankUpdateTime: currentTime });
  userTokenInfo &&  await userTokenInfo.reload();
  await updateLeagueLevel(telegramId);

  // await UserTokenInfo.update(
  //   {
  //     currentBalance: literal(`currentBalance + ${amount}`),
  //     turnOverBalance: literal(`turnOverBalance + ${amount}`),
  //   },
  //   { where: { userId } }
  // );

  return updatedReferralTrek;
}

//******************* Update League Trek Info ******************* //
export async function updateLeagueTrek(data: any) {
  const { userId, type, action, telegramId } = data;

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
    { 
      type: "Fan", 
      action: "claim", 
      fieldName: "claimedForFan", 
      amount: 10000 
    },
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
    {
      type: "Master",
      action: "claim",
      fieldName: "claimedForMaster",
      amount: 500000,
    },
    {
      type: "Pro",
      action: "claim",
      fieldName: "claimedForPro",
      amount: 1000000,
    },
    {
      type: "Veteran",
      action: "claim",
      fieldName: "claimedForVeteran",
      amount: 5000000,
    },
    {
      type: "Champion",
      action: "claim",
      fieldName: "claimedForChampion",
      amount: 10000000,
    },
    {
      type: "Degen",
      action: "claim",
      fieldName: "claimedForDegen",
      amount: 50000000,
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

  const currentTime = new Date();
  const userTokenInfo = await UserTokenInfo.findOne({where :{ userId : userId}});
  userTokenInfo && await userTokenInfo.increment('currentBalance', { by: amount });
  userTokenInfo && await userTokenInfo.increment('turnOverBalance', { by: amount });
  userTokenInfo && await userTokenInfo.update({ tankUpdateTime: currentTime });
  userTokenInfo &&  await userTokenInfo.reload();
  await updateLeagueLevel(telegramId);

  // await UserTokenInfo.update(
  //   {
  //     currentBalance: literal(`currentBalance + ${amount}`),
  //     turnOverBalance: literal(`turnOverBalance + ${amount}`),
  //   },
  //   { where: { userId } }
  // );

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
    raw : true
  });
  console.log("getting referral trek information ::::;", referralTrek)

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
  await ReferralTrek.update(referralTrek, {
    where: { id: referralTrek.id }
  });
}

//******************* Check league/ status level and update it ******************* //
export async function updateLeagueLevel(telegramId: string | undefined) {
  const checkAvlUser = await User.findOne({
    where: { telegramId },
  });

  if (!checkAvlUser) {
    return null;
  }
  const checkAvlUserTokenInfo = await UserTokenInfo.findOne({
    where: { userId: checkAvlUser?.id },
    raw : true,
    attributes: ["currentBalance", "statusId", "turnOverBalance"],
  });

  console.log("Balance info: ", checkAvlUserTokenInfo);

  var checkAvlRequiredStatsInfo = await StatusInfo.findOne({
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

  if(checkAvlUserTokenInfo && checkAvlUserTokenInfo?.turnOverBalance > 500000000) {
    checkAvlRequiredStatsInfo = await StatusInfo.findOne({
      where : {
        status : 'Degen'
      }
    })
  };

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
    { type: "Master", fieldName: "readyToClaimForMaster", amount: 500000 },
    { type: "Pro", fieldName: "readyToClaimForPro", amount: 1000000 },
    { type: "Veteran", fieldName: "readyToClaimForVeteran", amount: 5000000 },
    { type: "Champion", fieldName: "readyToClaimForChampion", amount: 10000000 },
    { type: "Degen", fieldName: "readyToClaimForDegen", amount: 50000000 },
  ];

  const field = leagueTrekList.filter(
    (item) => item.type === checkAvlRequiredStatsInfo?.status
  )[0];


  var fieldName = field?.fieldName;

  if(checkAvlUserTokenInfo && checkAvlUserTokenInfo?.turnOverBalance > 500000000) {
    fieldName = 'readyToClaimForDegen'
  };

  console.log("getting in this field", fieldName);

  const updatedLeagueTrek = await LeagueTrek.update(
    { [fieldName]: true },
    { where: { userId: checkAvlUser.id } }
  );
}
