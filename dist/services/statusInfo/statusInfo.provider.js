"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getStatusList = exports.addStatusInfo = void 0;
const statusInfo_schema_1 = require("../../schema/statusInfo.schema");
const ResponseFormat_1 = require("../../utils/ResponseFormat");
const Enum_1 = require("../../utils/Enum");
// import statusInfoModel from "../../schema/statusInfo.schema";
const addStatusInfo = (req) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { status, minRequired, maxRequired } = req.body;
        const addStatusInfo = yield statusInfo_schema_1.StatusInfo.create({
            status,
            minRequired,
            maxRequired
        });
        return (0, ResponseFormat_1.GenResObj)(Enum_1.HttpStatusCodes.OK, true, "Add status info successfully", addStatusInfo);
    }
    catch (error) {
        console.log("Getting error for adding the status info :", error);
        return (0, ResponseFormat_1.GenResObj)(Enum_1.HttpStatusCodes.INTERNAL_SERVER, false, "Internal server error", null);
    }
});
exports.addStatusInfo = addStatusInfo;
const getStatusList = () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const statusInfoList = yield statusInfo_schema_1.StatusInfo.findAll();
        return (0, ResponseFormat_1.GenResObj)(Enum_1.HttpStatusCodes.OK, true, 'Status info fetched successfully', statusInfoList);
    }
    catch (error) {
        console.log("Getting error for getting the status info :", error);
        return (0, ResponseFormat_1.GenResObj)(Enum_1.HttpStatusCodes.INTERNAL_SERVER, false, "Internal server error", null);
    }
});
exports.getStatusList = getStatusList;
