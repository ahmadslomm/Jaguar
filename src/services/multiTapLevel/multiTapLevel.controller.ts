import { Request, Response } from "express";
import * as LevelInfoProvider from './multiTapLevel.provider';
import { TLevelInfoModel, TResponse } from "../../utils/Types";

export const LevelInfoController = {
    addMultiTapLevel : async ( req : Request, res: Response ) => {
        const { code, data }  : TResponse= await LevelInfoProvider.addMultiTapLevel(req);
        res.status(code).json(data);
        return;
    },

    getMultiTapLevel : async ( req : Request, res: Response ) => {
        const { code, data } : TResponse = await LevelInfoProvider.getMultiTapLevel();
        res.status(code).json(data);
        return;
    }
}