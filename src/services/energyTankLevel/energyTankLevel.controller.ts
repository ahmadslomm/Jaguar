import { Request, Response } from "express";
import * as LevelInfoProvider from './energyTankLevel.provider';
import { TLevelInfoModel, TResponse } from "../../utils/Types";

export const LevelInfoController = {
    addEnergyTankLevel : async ( req : Request, res: Response ) => {
        const { code, data }  : TResponse= await LevelInfoProvider.addEnergyTankLevel(req);
        res.status(code).json(data);
        return;
    },

    getEnergyTankLevel : async ( req : Request, res: Response ) => {
        const { code, data } : TResponse = await LevelInfoProvider.getEnergyTankLevel();
        res.status(code).json(data);
        return;
    }
}