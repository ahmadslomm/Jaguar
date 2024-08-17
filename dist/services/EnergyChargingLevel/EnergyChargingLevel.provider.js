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
exports.getEnergyChargingLevel = exports.addEnergyChargingLevel = void 0;
const energyChargingLevel_schema_1 = require("../../schema/energyChargingLevel.schema");
const ResponseFormat_1 = require("../../utils/ResponseFormat");
const Enum_1 = require("../../utils/Enum");
const addEnergyChargingLevel = (req) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { level, levelName, chargingSpeed, amount } = req.body;
        const createLevel = yield energyChargingLevel_schema_1.EnergyChargingLevel.create({ level, levelName, chargingSpeed, amount });
        return (0, ResponseFormat_1.GenResObj)(Enum_1.HttpStatusCodes.CREATED, true, "Energy charging level added successfully", createLevel);
    }
    catch (error) {
        console.log("Getting error for creating the level for energy charging :", error);
        return (0, ResponseFormat_1.GenResObj)(Enum_1.HttpStatusCodes.INTERNAL_SERVER, false, "Internal server error", null);
    }
});
exports.addEnergyChargingLevel = addEnergyChargingLevel;
const getEnergyChargingLevel = () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const levelInfo = yield energyChargingLevel_schema_1.EnergyChargingLevel.findAll();
        return (0, ResponseFormat_1.GenResObj)(Enum_1.HttpStatusCodes.OK, true, "Energy charging level info fetched successfully", levelInfo);
    }
    catch (error) {
        console.log("Getting error for energy charging level info :", error);
        return (0, ResponseFormat_1.GenResObj)(Enum_1.HttpStatusCodes.INTERNAL_SERVER, false, "Internal server error", null);
    }
});
exports.getEnergyChargingLevel = getEnergyChargingLevel;
