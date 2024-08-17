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
exports.getMultiTapLevel = exports.addMultiTapLevel = void 0;
const multiTapLevel_schema_1 = require("../../schema/multiTapLevel.schema");
const ResponseFormat_1 = require("../../utils/ResponseFormat");
const Enum_1 = require("../../utils/Enum");
const addMultiTapLevel = (req) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { level, levelName, tap, amount } = req.body;
        const createLevel = yield multiTapLevel_schema_1.MultiTapLevel.create({ level, levelName, tap, amount });
        return (0, ResponseFormat_1.GenResObj)(Enum_1.HttpStatusCodes.CREATED, true, "Multi tap level added successfully", createLevel);
    }
    catch (error) {
        console.log("Getting error for creating the level for multi tapping :", error);
        return (0, ResponseFormat_1.GenResObj)(Enum_1.HttpStatusCodes.INTERNAL_SERVER, false, "Internal server error", null);
    }
});
exports.addMultiTapLevel = addMultiTapLevel;
const getMultiTapLevel = () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const levelInfo = yield multiTapLevel_schema_1.MultiTapLevel.findAll();
        return (0, ResponseFormat_1.GenResObj)(Enum_1.HttpStatusCodes.OK, true, "Multi tap level info fetched successfully", levelInfo);
    }
    catch (error) {
        console.log("Getting error for getting multi tap level info :", error);
        return (0, ResponseFormat_1.GenResObj)(Enum_1.HttpStatusCodes.INTERNAL_SERVER, false, "Internal server error", null);
    }
});
exports.getMultiTapLevel = getMultiTapLevel;
