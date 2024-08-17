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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getLevel = exports.addLevel = void 0;
const levelInfo_schema_1 = __importDefault(require("../../schema/levelInfo.schema"));
const ResponseFormat_1 = require("../../utils/ResponseFormat");
const Enum_1 = require("../../utils/Enum");
const addLevel = (req) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { level, levelName } = req.body;
        const createLevel = yield levelInfo_schema_1.default.create({ level, levelName });
        return (0, ResponseFormat_1.GenResObj)(Enum_1.HttpStatusCodes.CREATED, true, "Level added successfully", createLevel);
    }
    catch (error) {
        console.log("Getting error for creating the level :", error);
        return (0, ResponseFormat_1.GenResObj)(Enum_1.HttpStatusCodes.INTERNAL_SERVER, false, "Internal server error", null);
    }
});
exports.addLevel = addLevel;
const getLevel = () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const levelInfo = yield levelInfo_schema_1.default.find({});
        return (0, ResponseFormat_1.GenResObj)(Enum_1.HttpStatusCodes.OK, true, "Level info fetched successfully", levelInfo);
    }
    catch (error) {
        console.log("Getting error for getting level info :", error);
        return (0, ResponseFormat_1.GenResObj)(Enum_1.HttpStatusCodes.INTERNAL_SERVER, false, "Internal server error", null);
    }
});
exports.getLevel = getLevel;
