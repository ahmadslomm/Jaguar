import User from "../schema/user.schema";
import LevelInfo from "../schema/levelInfo.schema";
import StatusInfo from "../schema/statusInfo.schema";
import UserTokenInfo from "../schema/userTokenInfo.schema";
import MultiTapLevel from "../schema/multiTapLevel.schema";
import EnergyTankLevel from "../schema/energyTankLevel.schema";
import EnergyChargingLevel from "../schema/energyChargingLevel.schema";
import { TTelegramUserInfo, TUserModel } from "../utils/Types";
import { Types } from "mongoose";

// ******************* Register User For Server-side Bot Request******************* //

export const registerUser = async (userInfo: TTelegramUserInfo) => {
  try {
    const { first_name, last_name, id } = userInfo;

    const user = await User.findOneAndUpdate(
      { telegramId: id },
      { telegramId: id, firstName: first_name, lastName: last_name },
      { upsert: true, new: true }
    );

    if (user) {
      return true;
    }

    return false;
  } catch (error) {
    return false;
  }
};

// ******************* Create User With Status and different Level ID *******************
export const createUser = async (userInfo: TUserModel) => {
  try {
    const { firstName, lastName, telegramId } = userInfo;

    const getLevelInfo = await LevelInfo.findOne({ levelName: "LEVEL-1" });

    const getMultiTapLevel = await MultiTapLevel.findOne(
      { levelName: "LEVEL-1" },
      { _id: 1, levelName: 1 }
    );
    const getEnergyTankLevel = await EnergyTankLevel.findOne(
      { levelName: "LEVEL-1" },
      { _id: 1, levelName: 1, tankCapacity: 1 }
    );
    const getEnergyChargingLevel = await EnergyChargingLevel.findOne(
      { levelName: "LEVEL-1" },
      { _id: 1, levelName: 1 }
    );

    const getStatusInfo = await StatusInfo.findOne({ minRequired: 0 });

    const createuser = await User.create({
      telegramId,
      firstName,
      lastName,
    });

    if (createuser) {
      const userTokenInfo = await UserTokenInfo.create({
        userId: createuser._id,
        statusId: getStatusInfo?._id,
        totalTankCapacity: getEnergyTankLevel?.tankCapacity,
        levelId: getLevelInfo?._id,
        multiTapLevel: getMultiTapLevel?.levelName,
        energyTankLevel: getEnergyTankLevel?.levelName,
        energyChargingLevel: getEnergyChargingLevel?.levelName,
        tankUpdateTime: new Date(),
      });
    }
  } catch (error) {
    console.log(
      "Getting error for creating user with level and status : ",
      error
    );
    throw error;
  }
};

// ******************* Calculation for energy tank balance ******************* //
export const calculateEnergyTankBalance = async (
  userId: Types.ObjectId | string | undefined
) => {
  try {
    const userTokenInfo = await UserTokenInfo.findOne({
      userId: new Types.ObjectId(userId),
    });

    const getEnergyTankLevel = await EnergyTankLevel.findOne({
      levelName: userTokenInfo?.energyTankLevel,
    });

    const getEnergyChargingLevel: any = await EnergyChargingLevel.findOne({
      levelName: userTokenInfo?.energyChargingLevel,
    });

    const currentTime = new Date();

    const lastUpdateTime = userTokenInfo?.tankUpdateTime;

    let updateFiled: any = { tankUpdateTime: new Date() };

    // console.log("0000000000", userTokenInfo?.totalTankCapacity, userTokenInfo?.currentTankBalance)
    // console.log("Getting the last update time for ", lastUpdateTime);
    if (lastUpdateTime) {
      const lastUpdateDate = new Date(lastUpdateTime).setHours(0, 0, 0, 0);
      const currentDate = new Date(currentTime).setHours(0, 0, 0, 0);

      console.log("Getting dates : ", lastUpdateDate, currentDate )

      lastUpdateDate !== currentDate &&
        (updateFiled["dailyChargingBooster"] = 7);
      lastUpdateDate !== currentDate &&
        (updateFiled["dailyTappingBoosters"] = 7);

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

        updateFiled = { currentTankBalance: updatedTankBalance };
      }

      // console.log("3333333", updatedTankBalance)
      
      // console.log("4444444", updateUserTokenInfo)
    }
    console.log(
      "Getting the updatedFiled ********************************",
      updateFiled
    );
    const updateUserTokenInfo = await UserTokenInfo.findOneAndUpdate(
      { userId: new Types.ObjectId(userId) },
      { ...updateFiled },
      { new: true }
    );
    return;
  } catch (error) {
    console.log("Getting error for calculating energy tank balance : ", error);
    throw error;
  }
};
