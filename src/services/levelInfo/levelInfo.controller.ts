import { Request, Response } from "express";
import * as LevelInfoProvider from './levelInfo.provider';
import { TLevelInfoModel, TResponse } from "../../utils/Types";

export const LevelInfoController = {
    addLevel : async ( req : Request, res: Response ) => {
        const { code, data }  : TResponse= await LevelInfoProvider.addLevel(req);
        res.status(code).json(data);
        return;
    },

    getLevel : async ( req : Request, res: Response ) => {
        const { code, data } : TResponse = await LevelInfoProvider.getLevel();
        res.status(code).json(data);
        return;
    }
}