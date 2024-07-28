import { Request, Response } from 'express'
import { TLevelInfoModel } from "../../utils/Types";
import LevelInfo from "../../schema/levelInfo.schema";
import MultiTapLevel from '../../schema/multiTapLevel.schema';
import { GenResObj } from "../../utils/ResponseFormat";
import { HttpStatusCodes as Code } from "../../utils/Enum";

export const addMultiTapLevel = async(req : Request) => {
    try {
        const { level, levelName, tap, amount } = req.body;

        const createLevel = await MultiTapLevel.create({level, levelName, tap, amount});

        return GenResObj(Code.CREATED, true, "Multi tap level added successfully", createLevel)
    } catch (error) {
        console.log("Getting error for creating the level for multi tapping :", error);
        return GenResObj(Code.INTERNAL_SERVER, false, "Internal server error", null);
    }
};

export const getMultiTapLevel = async() => {
    try {
        
        const levelInfo = await MultiTapLevel.find({});

        return GenResObj(Code.OK, true, "Multi tap level info fetched successfully", levelInfo)

    } catch (error) {
        console.log("Getting error for getting multi tap level info :", error);
        return GenResObj(Code.INTERNAL_SERVER, false, "Internal server error", null);
    }
}