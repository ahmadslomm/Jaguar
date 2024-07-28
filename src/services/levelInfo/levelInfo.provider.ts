import { Request, Response } from 'express'
import { TLevelInfoModel } from "../../utils/Types";
import LevelInfo from "../../schema/levelInfo.schema";
import { GenResObj } from "../../utils/ResponseFormat";
import { HttpStatusCodes as Code } from "../../utils/Enum";

export const addLevel = async(req : Request) => {
    try {
        const { level, levelName } = req.body;

        const createLevel = await LevelInfo.create({level, levelName});

        return GenResObj(Code.CREATED, true, "Level added successfully", createLevel)
    } catch (error) {
        console.log("Getting error for creating the level :", error);
        return GenResObj(Code.INTERNAL_SERVER, false, "Internal server error", null);
    }
};

export const getLevel = async() => {
    try {
        
        const levelInfo = await LevelInfo.find({});

        return GenResObj(Code.OK, true, "Level info fetched successfully", levelInfo)

    } catch (error) {
        console.log("Getting error for getting level info :", error);
        return GenResObj(Code.INTERNAL_SERVER, false, "Internal server error", null);
    }
}