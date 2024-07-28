import { Request, Response } from "express";
import { AuthRequest }  from './../../middleware/authentication/jsonToken';
import User from "../../schema/user.schema";
import LevelInfo from "../../schema/levelInfo.schema";
import StatusInfo from "../../schema/statusInfo.schema";
import UserTokenInfo from "../../schema/userTokenInfo.schema";
import { HttpStatusCodes as Code } from "../../utils/Enum";
import { GenResObj } from '../../utils/ResponseFormat';
import { calculateEnergyTankBalance } from "../../helper/function";
import { Types } from "mongoose";

export const getUserTokenInfo = async(req: AuthRequest) => {
    try {
        const { telegramId } = req;
        // console.log("Getting the telegrame ID of : ", telegramId)
        const user :any= await User.findOne({ telegramId });

        // console.log("object", user)
        
        await calculateEnergyTankBalance(user?._id);

        const userTokenInfo = await UserTokenInfo.findOne({ userId : user?._id });

        console.log("Getting the user token info : ", userTokenInfo)
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

        const user :any= await User.findOne({ telegramId });

        const updateUserTokenInfo = await UserTokenInfo.findOneAndUpdate({ userId : new Types.ObjectId(user?._id) }, { $inc : { currentBalance : token, turnOverBalance: token}}, { new : true});

        return GenResObj(Code.OK, true, "Token balance added successfully.", updateUserTokenInfo)
    } catch (error) {
        console.log("Getting error for adding token balance :", error);
        return GenResObj(Code.INTERNAL_SERVER, false, "Internal server error", null);
    }
}