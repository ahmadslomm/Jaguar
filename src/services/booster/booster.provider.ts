import { Request, Response  } from 'express';
import { HttpStatusCodes as Code } from '../../utils/Enum';
import { GenResObj } from '../../utils/ResponseFormat';
import UserTokenInfo from '../../schema/userTokenInfo.schema';
import User from '../../schema/user.schema';
import MultiTapLevel from '../../schema/multiTapLevel.schema';
import EnergyTankLevel from '../../schema/energyTankLevel.schema';
import EnergyChargingLevel from '../../schema/energyChargingLevel.schema';
import { Types } from 'mongoose';
import { TUserModel } from '../../utils/Types';

export const getBoosterInfo = async(req:Request) => {
    try {
        const { telegramId } = req.query;

        const checkAvlUser : any = await User.findOne({ telegramId });

        const checkAvlUserTokenInfo : any = await UserTokenInfo.findOne({ userId : new Types.ObjectId(checkAvlUser?._id)});

        // *************** Get next avaialable level for different booster *************** //
        const nextAvlMultitapLevel = parseInt(checkAvlUserTokenInfo?.multiTapLevel.split('-')[1]) + 1;

        const nextAvlEnergyTankLevel = parseInt(checkAvlUserTokenInfo?.energyTankLevel.split('-')[1]) + 1;

        const nextAvlEnergyChargingLevel = parseInt(checkAvlUserTokenInfo?.energyChargingLevel.split('-')[1]) + 1;

        // *************** Checking next level for difference boosters *************** //
        const checkAvlNextAvlMultitapLevel = await MultiTapLevel.findOne({ level : nextAvlMultitapLevel });

        const checkAvlNextAvlEnergyTankLevel = await EnergyTankLevel.findOne({ level : nextAvlEnergyTankLevel });

        const checkAvlNextAvlEnergyChargingLevel = await EnergyChargingLevel.findOne({ level : nextAvlEnergyChargingLevel });

        const resObj = {
            dailyChargingBooster : checkAvlUserTokenInfo?.dailyChargingBooster,
            dailyTappingBoosters : checkAvlUserTokenInfo?.dailyTappingBoosters,
            avlNextMultiTapLevel : checkAvlNextAvlMultitapLevel,
            avlNextEnergyTankLevel : checkAvlNextAvlEnergyTankLevel,
            avlNextEnergyChargingLevel : checkAvlNextAvlEnergyChargingLevel

        }

        return GenResObj(Code.OK, true, "Boost info fetched successfully.", resObj)
    } catch (error) {
        console.log("Getting error for getting boost info :", error);
        return GenResObj(
          Code.INTERNAL_SERVER,
          false,
          "Internal server error",
          null
        );  
    }
};

export const updateDailyBooster = async (req: Request) => {
    try {
        const { telegramId } = req.query;
        const { boosterType } = req.body;

        const checkAvlUser : any = await User.findOne({ telegramId });

        const checkAvlUserTokenInfo = await UserTokenInfo.findOne({ userId : new Types.ObjectId(checkAvlUser?._id), [boosterType] : { $lte : 7} });

        if(checkAvlUserTokenInfo) {
            const updateBooster = await UserTokenInfo.findOneAndUpdate({ userId : new Types.ObjectId(checkAvlUser?._id) }, { $inc : { [boosterType] : -1 } }, { new : true });
            return GenResObj(Code.OK, true, "Booster updated successfully.", updateBooster)
        }

        return GenResObj(Code.NOT_FOUND, false, "Booster not found.", null);        
    } catch (error) {
        console.log("Getting error for updating booster :", error);
        return GenResObj(
          Code.INTERNAL_SERVER,
          false,
          "Internal server error",
          null
        ); 
    }
}

