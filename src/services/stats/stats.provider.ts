import { Request, Response } from 'express';
import { GenResObj } from "../../utils/ResponseFormat";
import { HttpStatusCodes as Code  } from "../../utils/Enum";
import { AuthRequest } from '../../middleware/authentication/jsonToken';
import {User} from "../../schema/user.schema";
import {UserTokenInfo} from "../../schema/userTokenInfo.schema";

export const getStatsInfo = async (req : AuthRequest) => {
    try {
        const { telegramId } = req;
        const checkAvlUser = await User.findOne({ where : { telegramId } });
        const totalUserCount = await User.count();
        const totalTurnOverBalance = await UserTokenInfo.sum('turnOverBalance');
        const checkAvlUserTotalTurnOver = await UserTokenInfo.findOne({ where : { userId : checkAvlUser?.id }, attributes : ["turnOverBalance"], raw : true });
        const dailyActiveUser = Math.round(totalUserCount * 0.7);
        const totalCoinFlips = 0;

        const resObj = {
            totalFlipCoins : totalTurnOverBalance || 0,
            redeemedFlipTokens : checkAvlUserTotalTurnOver?.turnOverBalance || 0,
            totalPlayers : totalUserCount || 0,
            dailyActivePlayers : dailyActiveUser || 0,
            totalCoinFlips
        };

        return GenResObj(Code.OK, true, "Stats info fetched successfully", resObj);
        
    } catch (error) {
        console.log("Getting error for getting the status info :", error);
        return GenResObj(Code.INTERNAL_SERVER, false, "Internal server error", null);
    }
}