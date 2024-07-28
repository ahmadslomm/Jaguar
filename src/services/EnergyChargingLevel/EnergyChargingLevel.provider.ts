import { Request, Response } from 'express'
import { TLevelInfoModel } from "../../utils/Types";
import LevelInfo from "../../schema/levelInfo.schema";
import EnergyChargingLevel from '../../schema/energyChargingLevel.schema';
import { GenResObj } from "../../utils/ResponseFormat";
import { HttpStatusCodes as Code } from "../../utils/Enum";

export const addEnergyChargingLevel = async(req : Request) => {
    try {
        const { level, levelName, chargingSpeed, amount } = req.body;

        const createLevel = await EnergyChargingLevel.create({ level, levelName, chargingSpeed, amount });

        return GenResObj(Code.CREATED, true, "Energy charging level added successfully", createLevel)
    } catch (error) {
        console.log("Getting error for creating the level for energy charging :", error);
        return GenResObj(Code.INTERNAL_SERVER, false, "Internal server error", null);
    }
};

export const getEnergyChargingLevel = async() => {
    try {
        
        const levelInfo = await EnergyChargingLevel.find({});

        return GenResObj(Code.OK, true, "Energy charging level info fetched successfully", levelInfo)

    } catch (error) {
        console.log("Getting error for energy charging level info :", error);
        return GenResObj(Code.INTERNAL_SERVER, false, "Internal server error", null);
    }
}