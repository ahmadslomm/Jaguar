import { Request, Response } from "express";
import * as FlipCoinProvider from './flip-coin.provider';
import { TResponse } from "../../utils/Types";

export const FlipCoinController = {
    getUserFlipTokenInfo : async ( req: Request, res: Response ) => {
        const { code, data} : TResponse = await FlipCoinProvider.getUserFlipTokenInfo(req);
        res.status(code).json(data);
        return;
    },

    addUserFlipToken : async ( req: Request, res: Response ) => {
        const { code, data} : TResponse = await FlipCoinProvider.addUserFlipToken(req);
        res.status(code).json(data);
        return;
    },


}