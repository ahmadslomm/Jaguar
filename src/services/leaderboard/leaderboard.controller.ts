import { Request, Response } from "express";
import * as LeaderboardProvider from './leaderboard.provider';
import { TResponse } from "../../utils/Types";

export const LeaderboardController = {
    getLederBoardInfo : async ( req: Request, res : Response) => {
        const { code, data } : TResponse = await LeaderboardProvider.getLederBoardInfo(req);
        res.status(code).json(data);
        return;
    }
}