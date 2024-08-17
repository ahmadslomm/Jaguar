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
exports.updatelevel = exports.updateDailyBooster = exports.getBoosterInfo = void 0;
const Enum_1 = require("../../utils/Enum");
const ResponseFormat_1 = require("../../utils/ResponseFormat");
const userTokenInfo_schema_1 = require("../../schema/userTokenInfo.schema");
const user_schema_1 = require("../../schema/user.schema");
const multiTapLevel_schema_1 = require("../../schema/multiTapLevel.schema");
const energyTankLevel_schema_1 = require("../../schema/energyTankLevel.schema");
const energyChargingLevel_schema_1 = require("../../schema/energyChargingLevel.schema");
const sequelize_1 = require("sequelize");
const function_1 = require("../../helper/function");
const getBoosterInfo = (req) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { telegramId } = req;
        const checkAvlUser = yield user_schema_1.User.findOne({ where: { telegramId } });
        const checkAvlUserTokenInfo = yield userTokenInfo_schema_1.UserTokenInfo.findOne({
            where: { userId: checkAvlUser.id },
        });
        // *************** Get next avaialable level for different booster *************** //
        const nextAvlMultitapLevel = parseInt(checkAvlUserTokenInfo === null || checkAvlUserTokenInfo === void 0 ? void 0 : checkAvlUserTokenInfo.multiTapLevel.split("-")[1]) + 1;
        const nextAvlEnergyTankLevel = parseInt(checkAvlUserTokenInfo === null || checkAvlUserTokenInfo === void 0 ? void 0 : checkAvlUserTokenInfo.energyTankLevel.split("-")[1]) + 1;
        const nextAvlEnergyChargingLevel = parseInt(checkAvlUserTokenInfo === null || checkAvlUserTokenInfo === void 0 ? void 0 : checkAvlUserTokenInfo.energyChargingLevel.split("-")[1]) + 1;
        // *************** Checking next level for difference boosters *************** //
        const checkAvlNextAvlMultitapLevel = yield multiTapLevel_schema_1.MultiTapLevel.findOne({
            where: { level: nextAvlMultitapLevel },
        });
        const checkAvlNextAvlEnergyTankLevel = yield energyTankLevel_schema_1.EnergyTankLevel.findOne({
            where: { level: nextAvlEnergyTankLevel },
        });
        const checkAvlNextAvlEnergyChargingLevel = yield energyChargingLevel_schema_1.EnergyChargingLevel.findOne({
            where: { level: nextAvlEnergyChargingLevel },
        });
        const resObj = {
            totalCoins: checkAvlUserTokenInfo === null || checkAvlUserTokenInfo === void 0 ? void 0 : checkAvlUserTokenInfo.currentBalance,
            dailyChargingBooster: checkAvlUserTokenInfo === null || checkAvlUserTokenInfo === void 0 ? void 0 : checkAvlUserTokenInfo.dailyChargingBooster,
            dailyTappingBoosters: checkAvlUserTokenInfo === null || checkAvlUserTokenInfo === void 0 ? void 0 : checkAvlUserTokenInfo.dailyTappingBoosters,
            avlNextMultiTapLevel: checkAvlNextAvlMultitapLevel,
            avlNextEnergyTankLevel: checkAvlNextAvlEnergyTankLevel,
            avlNextEnergyChargingLevel: checkAvlNextAvlEnergyChargingLevel,
        };
        return (0, ResponseFormat_1.GenResObj)(Enum_1.HttpStatusCodes.OK, true, "Boost info fetched successfully.", resObj);
    }
    catch (error) {
        console.log("Getting error for getting boost info :", error);
        return (0, ResponseFormat_1.GenResObj)(Enum_1.HttpStatusCodes.INTERNAL_SERVER, false, "Internal server error", null);
    }
});
exports.getBoosterInfo = getBoosterInfo;
const updateDailyBooster = (req) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { telegramId } = req;
        const { boosterType } = req.body;
        const checkAvlUser = yield user_schema_1.User.findOne({ where: { telegramId } });
        console.log("Getting the check Avl User *******", checkAvlUser);
        const checkAvlUserTokenInfo = yield userTokenInfo_schema_1.UserTokenInfo.findOne({
            where: { userId: checkAvlUser === null || checkAvlUser === void 0 ? void 0 : checkAvlUser.id, [boosterType]: { [sequelize_1.Op.lte]: 7 } },
        });
        console.log("CheckAvlUSerInfo**************", checkAvlUser);
        if (checkAvlUserTokenInfo) {
            yield checkAvlUserTokenInfo.update({
                [boosterType]: (0, sequelize_1.literal)(`${boosterType} - 1`),
            });
            boosterType == 'dailyChargingBooster' && (yield (0, function_1.updateTankCapacity)(checkAvlUser === null || checkAvlUser === void 0 ? void 0 : checkAvlUser.id));
            const updateBoosterInfo = yield checkAvlUserTokenInfo.reload();
            // const updateBooster = await UserTokenInfo.findOneAndUpdate({ userId : new Types.ObjectIdcheckAvlUser?.i) }, { $inc : { [boosterType] : -1 } }, { new : true });
            return (0, ResponseFormat_1.GenResObj)(Enum_1.HttpStatusCodes.OK, true, "Booster updated successfully.", updateBoosterInfo);
        }
        return (0, ResponseFormat_1.GenResObj)(Enum_1.HttpStatusCodes.NOT_FOUND, false, "Booster not found.", null);
    }
    catch (error) {
        console.log("Getting error for updating booster :", error);
        return (0, ResponseFormat_1.GenResObj)(Enum_1.HttpStatusCodes.INTERNAL_SERVER, false, "Internal server error", null);
    }
});
exports.updateDailyBooster = updateDailyBooster;
const updatelevel = (req) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { telegramId } = req;
        const { boosterType } = req.body;
        const checkAvlUser = yield user_schema_1.User.findOne({ where: { telegramId } });
        const checkAvlUserTokenInfo = yield userTokenInfo_schema_1.UserTokenInfo.findOne({
            where: { userId: checkAvlUser === null || checkAvlUser === void 0 ? void 0 : checkAvlUser.id },
        });
        const collectionType = boosterType == "multiTapLevel"
            ? multiTapLevel_schema_1.MultiTapLevel
            : boosterType == "energyTankLevel"
                ? energyTankLevel_schema_1.EnergyTankLevel
                : energyChargingLevel_schema_1.EnergyChargingLevel;
        const checkAvlLevelNameInfUserTokenInfo = boosterType == "multiTapLevel"
            ? checkAvlUserTokenInfo === null || checkAvlUserTokenInfo === void 0 ? void 0 : checkAvlUserTokenInfo.multiTapLevel
            : boosterType == "energyTankLevel"
                ? checkAvlUserTokenInfo === null || checkAvlUserTokenInfo === void 0 ? void 0 : checkAvlUserTokenInfo.energyTankLevel
                : checkAvlUserTokenInfo === null || checkAvlUserTokenInfo === void 0 ? void 0 : checkAvlUserTokenInfo.energyChargingLevel;
        const updatedNextLevelName = "LEVEL-" +
            (parseInt(checkAvlLevelNameInfUserTokenInfo === null || checkAvlLevelNameInfUserTokenInfo === void 0 ? void 0 : checkAvlLevelNameInfUserTokenInfo.split("-")[1]) + 1);
        console.log("first level name ", checkAvlLevelNameInfUserTokenInfo, " updated", updatedNextLevelName);
        const checkAvlNextLevelInfo = yield collectionType.findOne({ where: {
                levelName: updatedNextLevelName,
            } });
        if (checkAvlNextLevelInfo.amount <= checkAvlUserTokenInfo.currentBalance) {
            const udpatedCurrenetBalance = checkAvlUserTokenInfo.currentBalance - checkAvlNextLevelInfo.amount;
            const updateUserTokenInfo = yield userTokenInfo_schema_1.UserTokenInfo.update({
                [boosterType]: updatedNextLevelName,
                currentBalance: udpatedCurrenetBalance,
            }, {
                where: {
                    userId: checkAvlUser.id,
                },
                returning: true,
            });
            console.log("Updated dta: " + udpatedCurrenetBalance);
            // const updateUserTokenInfo:any = await UserTokenInfo.findOneAndUpdate({ userId : new Types.ObjectId(checkAvlUser?._id) }, { $set : { [boosterType] : updatedNextLevelName, currentBalance : udpatedCurrenetBalance} }, { new : true });
            return (0, ResponseFormat_1.GenResObj)(Enum_1.HttpStatusCodes.OK, true, "Level updated successfully", updateUserTokenInfo);
        }
        else {
            console.log("gettng in to the else condition failed");
            return (0, ResponseFormat_1.GenResObj)(Enum_1.HttpStatusCodes.NOT_FOUND, false, "Insufficient balance.", null);
        }
        return (0, ResponseFormat_1.GenResObj)(Enum_1.HttpStatusCodes.NOT_FOUND, false, "Something went wrong", null);
    }
    catch (error) {
        console.log("Getting error for updating booster :", error);
        return (0, ResponseFormat_1.GenResObj)(Enum_1.HttpStatusCodes.INTERNAL_SERVER, false, "Internal server error", null);
    }
});
exports.updatelevel = updatelevel;
