import { Request, Response } from "express";
import { AuthRequest }  from './../../middleware/authentication/jsonToken';
import {User} from "../../schema/user.schema";
import LevelInfo from "../../schema/levelInfo.schema";
import {StatusInfo} from "../../schema/statusInfo.schema";
import {UserTokenInfo} from "../../schema/userTokenInfo.schema";
import { HttpStatusCodes as Code } from "../../utils/Enum";
import { GenResObj } from '../../utils/ResponseFormat';
import { calculateEnergyTankBalance } from "../../helper/function";
import { Types } from "mongoose";
import { literal } from "sequelize";

export const getUserTokenInfo = async(req: AuthRequest) => {
    try {
        const { telegramId } = req;
        console.log("Getting the telegrame ID of : ", telegramId)
        const user :any= await User.findOne({where :{ telegramId }});

        // console.log("object", user)
        
        await calculateEnergyTankBalance(user?.id);

        const userTokenInfo = await UserTokenInfo.findOne({where :{ userId : user?.id }});

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
        const { token } = req.body;
        // console.log("object")
        const user :any= await User.findOne({where :{ telegramId }});
        const userTokenInfo = await UserTokenInfo.findOne({where :{ userId : user?.id }});
        const currentTime = new Date();
        if(userTokenInfo) {
            await userTokenInfo.update(
                {
                    currentBalance: literal(`currentBalance + ${token}`),
                    turnOverBalance: literal(`turnOverBalance + ${token}`),
                    currentTankBalance: literal(`currentTankBalance - ${token}`),
                    tankUpdateTime: currentTime
                },
                { where: { userId : user?.id } }
            )
            const updateUserTokenInfo = await user.reload();
            return GenResObj(Code.OK, true, "Token balance added successfully.", updateUserTokenInfo)
        }
        // const updateUserTokenInfo = await UserTokenInfo.findOneAndUpdate({ userId : new Types.ObjectId(user?._id) }, { $inc : { currentBalance : token, turnOverBalance: token}}, { new : true});
        return GenResObj(Code.NOT_FOUND, false, "Something went wrong.", null )
    } catch (error) {
        console.log("Getting error for adding token balance :", error);
        return GenResObj(Code.INTERNAL_SERVER, false, "Internal server error", null);
    }
}