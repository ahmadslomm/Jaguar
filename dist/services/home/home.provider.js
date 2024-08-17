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
exports.addTokenbalance = exports.getUserTokenInfo = void 0;
const user_schema_1 = require("../../schema/user.schema");
const statusInfo_schema_1 = require("../../schema/statusInfo.schema");
const userTokenInfo_schema_1 = require("../../schema/userTokenInfo.schema");
const Enum_1 = require("../../utils/Enum");
const ResponseFormat_1 = require("../../utils/ResponseFormat");
const function_1 = require("../../helper/function");
const getUserTokenInfo = (req) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { telegramId } = req;
        console.log("Getting the telegrame ID of : ", telegramId);
        const user = yield user_schema_1.User.findOne({ where: { telegramId } });
        // console.log("object", user)
        yield (0, function_1.calculateEnergyTankBalance)(user === null || user === void 0 ? void 0 : user.id);
        const userTokenInfo = yield userTokenInfo_schema_1.UserTokenInfo.findOne({
            where: { userId: user === null || user === void 0 ? void 0 : user.id },
            attributes: ['currentBalance', 'totalTankCapacity', 'currentTankBalance', 'multiTapLevel', 'energyTankLevel', 'energyChargingLevel', 'dailyChargingBooster', 'dailyTappingBoosters'],
            include: [
                { model: statusInfo_schema_1.StatusInfo,
                    as: 'statusInfo',
                    attributes: ['status'] }
            ]
        });
        // console.log("Getting the user token info : ", userTokenInfo)
        return (0, ResponseFormat_1.GenResObj)(Enum_1.HttpStatusCodes.OK, true, "User token info fetched successfully.", userTokenInfo);
    }
    catch (error) {
        console.log("Getting error for getting user token info :", error);
        return (0, ResponseFormat_1.GenResObj)(Enum_1.HttpStatusCodes.INTERNAL_SERVER, false, "Internal server error", null);
    }
});
exports.getUserTokenInfo = getUserTokenInfo;
const addTokenbalance = (req) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { telegramId } = req;
        const { token, currentTankBalance } = req.body;
        // console.log("object")
        const user = yield user_schema_1.User.findOne({ where: { telegramId } });
        const userTokenInfo = yield userTokenInfo_schema_1.UserTokenInfo.findOne({ where: { userId: user === null || user === void 0 ? void 0 : user.id } });
        const currentTime = new Date();
        if (userTokenInfo) {
            // await userTokenInfo.update(
            //     {
            //         currentBalance: literal(`currentBalance + ${token}`),
            //         turnOverBalance: literal(`turnOverBalance + ${token}`),
            //         currentTankBalance: literal(`currentTankBalance - ${token}`),
            //         tankUpdateTime: currentTime
            //     },
            //     { where: { userId : user?.id } }
            // )
            yield userTokenInfo.increment('currentBalance', { by: token });
            yield userTokenInfo.increment('turnOverBalance', { by: token });
            // await userTokenInfo.decrement('currentTankBalance', { by: token });
            yield userTokenInfo.update({ tankUpdateTime: currentTime, currentTankBalance });
            const updatedUserTokenInfo = yield userTokenInfo.reload();
            yield (0, function_1.updateLeagueLevel)(telegramId);
            // const updateUserTokenInfo = await user.reload();
            return (0, ResponseFormat_1.GenResObj)(Enum_1.HttpStatusCodes.OK, true, "Token balance added successfully.", updatedUserTokenInfo);
        }
        // const updateUserTokenInfo = await UserTokenInfo.findOneAndUpdate({ userId : new Types.ObjectId(user?._id) }, { $inc : { currentBalance : token, turnOverBalance: token}}, { new : true});
        return (0, ResponseFormat_1.GenResObj)(Enum_1.HttpStatusCodes.NOT_FOUND, false, "Something went wrong.", null);
    }
    catch (error) {
        console.log("Getting error for adding token balance :", error);
        return (0, ResponseFormat_1.GenResObj)(Enum_1.HttpStatusCodes.INTERNAL_SERVER, false, "Internal server error", null);
    }
});
exports.addTokenbalance = addTokenbalance;
