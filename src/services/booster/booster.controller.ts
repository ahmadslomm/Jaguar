import { Request, Response } from "express";
import * as BoosterProvider from "./booster.provider";
import { TResponse } from "../../utils/Types";

export const BoosterController = {

    getBoosterInfo : async(req: Request, res: Response) => {
        const { code, data } : TResponse = await BoosterProvider.getBoosterInfo(req);
        res.status(code).json(data);
        return;
    },

    updateDailyBooster : async(req: Request, res: Response) => {
        const { code, data } : TResponse = await BoosterProvider.updateDailyBooster(req);
        res.status(code).json(data);
        return;
    }
}