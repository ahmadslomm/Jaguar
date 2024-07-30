import { Request, Response } from 'express'
import { TLevelInfoModel } from "../../utils/Types";
import LevelInfo from "../../schema/levelInfo.schema";
import {EnergyTankLevel} from '../../schema/energyTankLevel.schema';
import { GenResObj } from "../../utils/ResponseFormat";
import { HttpStatusCodes as Code } from "../../utils/Enum";

export const addEnergyTankLevel = async(req : Request) => {
    try {
        const {  level, levelName, tankCapacity, amount } = req.body;

        const createLevel = await EnergyTankLevel.create({ level, levelName, tankCapacity, amount });

        return GenResObj(Code.CREATED, true, "Energy tank level added successfully", createLevel)
    } catch (error) {
        console.log("Getting error for creating the level for energy tank :", error);
        return GenResObj(Code.INTERNAL_SERVER, false, "Internal server error", null);
    }
};

export const getEnergyTankLevel = async() => {
    try {
        
        const levelInfo = await EnergyTankLevel.findAll();

        return GenResObj(Code.OK, true, "Energy tank level info fetched successfully", levelInfo)

    } catch (error) {
        console.log("Getting error for getting energy tank level info :", error);
        return GenResObj(Code.INTERNAL_SERVER, false, "Internal server error", null);
    }
}