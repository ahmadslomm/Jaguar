import { Request, Response } from "express";
import { AuthRequest }  from './../../middleware/authentication/jsonToken';
import {User} from "../../schema/user.schema";
import LevelInfo from "../../schema/levelInfo.schema";
import {StatusInfo} from "../../schema/statusInfo.schema";
import {UserTokenInfo} from "../../schema/userTokenInfo.schema";
import { HttpStatusCodes as Code } from "../../utils/Enum";
import { GenResObj } from '../../utils/ResponseFormat';
import { calculateEnergyTankBalance, updateLeagueLevel } from "../../helper/function";
import { Types } from "mongoose";
import { literal } from "sequelize";

export const getUserTokenInfo = async(req: AuthRequest) => {
    try {
        const { telegramId } = req;
        
        console.log("Getting the telegrame ID of : ", telegramId)
        const user :any= await User.findOne({where :{ telegramId }});

        // console.log("object", user)
        
        await calculateEnergyTankBalance(user?.id);

        const userTokenInfo = await UserTokenInfo.findOne(
            {
                where :{ userId : user?.id }, 
                attributes : ['currentBalance', 'totalTankCapacity', 'currentTankBalance', 'multiTapLevel', 'energyTankLevel', 'energyChargingLevel', 'dailyChargingBooster', 'dailyTappingBoosters'],
                include:[
                    {model : StatusInfo,
                    as : 'statusInfo',
                    attributes: ['status']}
                ]
            }
        );

        // console.log("Getting the user token info : ", userTokenInfo)
        return GenResObj(Code.OK, true, "User token info fetched successfully.", userTokenInfo)

    } catch (error) {
        console.log("Getting error for getting user token info :", error);
        return GenResObj(Code.INTERNAL_SERVER, false, "Internal server error", null);
    }
};

export const addTokenbalance = async (req: AuthRequest) => {
    try {
        const { telegramId } = req;
        const { token,  currentTankBalance} = req.body;
        // console.log("object")
        const user :any= await User.findOne({where :{ telegramId }});
        const userTokenInfo = await UserTokenInfo.findOne({where :{ userId : user?.id }});
        const currentTime = new Date();
        if(userTokenInfo) {
            // await userTokenInfo.update(
            //     {
            //         currentBalance: literal(`currentBalance + ${token}`),
            //         turnOverBalance: literal(`turnOverBalance + ${token}`),
            //         currentTankBalance: literal(`currentTankBalance - ${token}`),
            //         tankUpdateTime: currentTime
            //     },
            //     { where: { userId : user?.id } }
            // )
            await userTokenInfo.increment('currentBalance', { by: token });
            await userTokenInfo.increment('turnOverBalance', { by: token });
            // await userTokenInfo.decrement('currentTankBalance', { by: token });
            await userTokenInfo.update({ tankUpdateTime: currentTime, currentTankBalance });
            const updatedUserTokenInfo = await userTokenInfo.reload();

            await updateLeagueLevel(telegramId);
            // const updateUserTokenInfo = await user.reload();
            return GenResObj(Code.OK, true, "Token balance added successfully.", updatedUserTokenInfo)
        }
        // const updateUserTokenInfo = await UserTokenInfo.findOneAndUpdate({ userId : new Types.ObjectId(user?._id) }, { $inc : { currentBalance : token, turnOverBalance: token}}, { new : true});
        return GenResObj(Code.NOT_FOUND, false, "Something went wrong.", null )
    } catch (error) {
        console.log("Getting error for adding token balance :", error);
        return GenResObj(Code.INTERNAL_SERVER, false, "Internal server error", null);
    }
}