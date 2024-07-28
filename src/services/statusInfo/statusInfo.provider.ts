import { Request } from "express";
import StatusInfo from "../../schema/statusInfo.schema";
import { GenResObj } from "../../utils/ResponseFormat";
import { HttpStatusCodes as Code  } from "../../utils/Enum";
import statusInfoModel from "../../schema/statusInfo.schema";

export const addStatusInfo = async(req: Request)  => {
    try {
        const { status, minRequired, maxRequired } = req.body;

        const addStatusInfo = await StatusInfo.create({
            status,
            minRequired,
            maxRequired
        });

        return GenResObj(Code.OK, true, "Add status info successfully", addStatusInfo)
    } catch (error) {
        console.log("Getting error for adding the status info :", error);
        return GenResObj(Code.INTERNAL_SERVER, false, "Internal server error", null);
    }
};

export const getStatusList = async() => {
    try {
        const statusInfoList = await statusInfoModel.find({});

        return GenResObj(Code.OK, true, 'Status info fetched successfully',statusInfoList)
    } catch (error) {
        console.log("Getting error for getting the status info :", error);
        return GenResObj(Code.INTERNAL_SERVER, false, "Internal server error", null);
    }
}
