import { Request, Response } from 'express';
import { GenResObj } from "../../utils/ResponseFormat";
import { HttpStatusCodes as Code  } from "../../utils/Enum";
import { AuthRequest } from '../../middleware/authentication/jsonToken';
import {User} from "../../schema/user.schema";
import {UserTokenInfo} from "../../schema/userTokenInfo.schema";

export const getStatsInfo = async (req : AuthRequest) => {
    try {
        const { telegramId } = req;

        const totalUserCount = await User.count();
        const totalCurrentBalance = await UserTokenInfo.sum('currentBalance');
        
    } catch (error) {
        console.log("Getting error for getting the status info :", error);
        return GenResObj(Code.INTERNAL_SERVER, false, "Internal server error", null);
    }
}