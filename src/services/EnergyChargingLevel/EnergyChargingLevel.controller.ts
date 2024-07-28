import { Request, Response } from "express";
import * as LevelInfoProvider from './EnergyChargingLevel.provider';
import { TLevelInfoModel, TResponse } from "../../utils/Types";

export const LevelInfoController = {
    addEnergyChargingLevel : async ( req : Request, res: Response ) => {
        const { code, data }  : TResponse= await LevelInfoProvider.addEnergyChargingLevel(req);
        res.status(code).json(data);
        return;
    },

    getEnergyChargingLevel : async ( req : Request, res: Response ) => {
        const { code, data } : TResponse = await LevelInfoProvider.getEnergyChargingLevel();
        res.status(code).json(data);
        return;
    }
}