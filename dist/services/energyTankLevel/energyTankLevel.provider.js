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
exports.getEnergyTankLevel = exports.addEnergyTankLevel = void 0;
const energyTankLevel_schema_1 = require("../../schema/energyTankLevel.schema");
const ResponseFormat_1 = require("../../utils/ResponseFormat");
const Enum_1 = require("../../utils/Enum");
const addEnergyTankLevel = (req) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { level, levelName, tankCapacity, amount } = req.body;
        const createLevel = yield energyTankLevel_schema_1.EnergyTankLevel.create({ level, levelName, tankCapacity, amount });
        return (0, ResponseFormat_1.GenResObj)(Enum_1.HttpStatusCodes.CREATED, true, "Energy tank level added successfully", createLevel);
    }
    catch (error) {
        console.log("Getting error for creating the level for energy tank :", error);
        return (0, ResponseFormat_1.GenResObj)(Enum_1.HttpStatusCodes.INTERNAL_SERVER, false, "Internal server error", null);
    }
});
exports.addEnergyTankLevel = addEnergyTankLevel;
const getEnergyTankLevel = () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const levelInfo = yield energyTankLevel_schema_1.EnergyTankLevel.findAll();
        return (0, ResponseFormat_1.GenResObj)(Enum_1.HttpStatusCodes.OK, true, "Energy tank level info fetched successfully", levelInfo);
    }
    catch (error) {
        console.log("Getting error for getting energy tank level info :", error);
        return (0, ResponseFormat_1.GenResObj)(Enum_1.HttpStatusCodes.INTERNAL_SERVER, false, "Internal server error", null);
    }
});
exports.getEnergyTankLevel = getEnergyTankLevel;
