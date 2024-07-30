import {User} from "../schema/user.schema";
import LevelInfo from "../schema/levelInfo.schema";
import {StatusInfo} from "../schema/statusInfo.schema";
import {UserTokenInfo} from "../schema/userTokenInfo.schema";
import {MultiTapLevel} from "../schema/multiTapLevel.schema";
import {EnergyTankLevel} from "../schema/energyTankLevel.schema";
import {EnergyChargingLevel} from "../schema/energyChargingLevel.schema";
import jwt from 'jsonwebtoken';
import { TTelegramUserInfo, TUserModel } from "../utils/Types";
import { ObjectId, Types } from "mongoose";

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
      const { firstName, lastName, telegramId } = userInfo;
  
      // Fetch LevelInfo
    //   const levelInfo = {levelName :'LEVEL-1'};
      const levelInfo = await LevelInfo.findOne({ where: { levelName: "LEVEL-1" } });
  
      // Fetch MultiTapLevel
    //   const multiTapLevel = {levelName :'LEVEL-1'}
      const multiTapLevel = await MultiTapLevel.findOne({ where: { levelName: "LEVEL-1" }, attributes: ['id', 'levelName'] });
  
      // Fetch EnergyTankLevel
    //   const energyTankLevel ={levelName :  'LEVEL-1', tankCapacity : 500}
      const energyTankLevel = await EnergyTankLevel.findOne({ where: { levelName: "LEVEL-1" }, attributes: ['id', 'levelName', 'tankCapacity'] });
  
      // Fetch EnergyChargingLevel
    //   const energyChargingLevel = {levelName :'LEVEL-1'}
      const energyChargingLevel = await EnergyChargingLevel.findOne({ where: { levelName: "LEVEL-1" }, attributes: ['id', 'levelName'] });
  
      // Fetch StatusInfo
      const statusInfo = await StatusInfo.findOne({ where: { minRequired: 0 } });
  
      // Create User
      const createdUser = await User.create({
        telegramId,
        firstName,
        lastName,
      });

      console.log("Getting the user...", createdUser, energyChargingLevel, energyTankLevel);
      console.log(" statusInfo",  statusInfo)
      console.log(" energyChargingLevel",  energyChargingLevel)
      console.log(" energyTankLevel",  energyTankLevel)
    //   console.log(" statusInfo",  statusInfo)
      // Create UserTokenInfo if user creation was successful
      if (createdUser && statusInfo) {
          const createUserTokenInfoData:any = {
            userId: createdUser.id, // Ensure this is correctly assigned
            statusId: statusInfo?.id, // Ensure this is correctly assigned
            totalTankCapacity: energyTankLevel?.tankCapacity, // Ensure this is correctly assigned
            multiTapLevel: multiTapLevel?.levelName, // Ensure this is correctly assigned
            energyTankLevel: energyTankLevel?.levelName, // Ensure this is correctly assigned
            energyChargingLevel: energyChargingLevel?.levelName, // Ensure this is correctly assigned
            tankUpdateTime: new Date(), // Current timestamp
          };
        const temp = await UserTokenInfo.create(createUserTokenInfoData);
        console.log("Temp: " + temp)
    }
    } catch (error) {
      console.error("Getting error for creating user with level and status:", error);
      throw error;
    }
  };

// ******************* Calculation for energy tank balance ******************* //
export const calculateEnergyTankBalance = async (
  userId: string | undefined
) => {
  try {
    console.log("userID: " + userId)
    const userTokenInfo = await UserTokenInfo.findOne({where :{
      userId
    }});

    const getEnergyTankLevel = await EnergyTankLevel.findOne({where :{
      levelName: userTokenInfo?.energyTankLevel,
    }});

    const getEnergyChargingLevel: any = await EnergyChargingLevel.findOne({where :{
      levelName: userTokenInfo?.energyChargingLevel,
    }});

    const currentTime = new Date();

    const lastUpdateTime = userTokenInfo?.tankUpdateTime;

    let updateFiled: any = { tankUpdateTime: currentTime };

    // console.log("0000000000", userTokenInfo?.totalTankCapacity, userTokenInfo?.currentTankBalance)
    console.log("Getting the last update time for ", lastUpdateTime, currentTime );
    if (lastUpdateTime) {
      const lastUpdateDate = new Date(lastUpdateTime).setHours(0, 0, 0, 0);
      const currentDate = new Date(currentTime).setHours(0, 0, 0, 0);

    //   console.log("Getting dates : ", lastUpdateDate, currentDate )

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

        // updateFiled = { currentTankBalance: updatedTankBalance };
        // updateFiled["currentTankBalance"] = updatedTankBalance;
      }

      // console.log("3333333", updatedTankBalance)
      
      // console.log("4444444", updateUserTokenInfo)
    }
    // console.log(
    //   "Getting the updatedFiled ********************************",
    //   updateFiled
    // );
    const userTokenInfoForUpdate = await UserTokenInfo.findOne({ where: { userId } });

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