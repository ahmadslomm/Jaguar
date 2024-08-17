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
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateTaskStatus = exports.getTaskInfo = void 0;
const user_schema_1 = require("../../schema/user.schema");
const statusInfo_schema_1 = require("../../schema/statusInfo.schema");
const userTokenInfo_schema_1 = require("../../schema/userTokenInfo.schema");
const Enum_1 = require("../../utils/Enum");
const ResponseFormat_1 = require("../../utils/ResponseFormat");
const function_1 = require("../../helper/function");
const getTaskInfo = (req) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { telegramId } = req;
        console.log("object is ", telegramId);
        const user = yield user_schema_1.User.findOne({ where: { telegramId: telegramId } });
        console.log("userid is ", user === null || user === void 0 ? void 0 : user.id);
        const checkAvlUserTokenInfo = yield userTokenInfo_schema_1.UserTokenInfo.findOne({ where: { userId: user === null || user === void 0 ? void 0 : user.id },
            attributes: ['statusId', 'currentBalance'],
            include: [
                {
                    model: statusInfo_schema_1.StatusInfo,
                    attributes: ['status']
                }
            ] });
        if (user && (checkAvlUserTokenInfo === null || checkAvlUserTokenInfo === void 0 ? void 0 : checkAvlUserTokenInfo.statusId)) {
            const socialMediaTasks = yield (0, function_1.getSocialMediaTrekInfo)(user === null || user === void 0 ? void 0 : user.id);
            const referrealTrek = yield (0, function_1.getReferralTrekInfo)(user === null || user === void 0 ? void 0 : user.id);
            const leagueTrek = yield (0, function_1.getLeagueTrekInfo)(user === null || user === void 0 ? void 0 : user.id, checkAvlUserTokenInfo === null || checkAvlUserTokenInfo === void 0 ? void 0 : checkAvlUserTokenInfo.statusId);
            const responseObj = {
                totalCoins: checkAvlUserTokenInfo === null || checkAvlUserTokenInfo === void 0 ? void 0 : checkAvlUserTokenInfo.currentBalance,
                social: socialMediaTasks,
                refer: referrealTrek,
                league: leagueTrek
            };
            return (0, ResponseFormat_1.GenResObj)(Enum_1.HttpStatusCodes.OK, true, "Task info get successfully", responseObj);
        }
        ;
        return (0, ResponseFormat_1.GenResObj)(Enum_1.HttpStatusCodes.NOT_FOUND, false, "User not found", null);
    }
    catch (error) {
        console.log("Getting error for getting task info: " + error);
        return (0, ResponseFormat_1.GenResObj)(Enum_1.HttpStatusCodes.INTERNAL_SERVER, false, "Internal server error", null);
    }
});
exports.getTaskInfo = getTaskInfo;
const updateTaskStatus = (req) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { telegramId, userId } = req;
        const _a = req.body, { section } = _a, payload = __rest(_a, ["section"]);
        let updatedRecord;
        switch (section) {
            case 'social':
                updatedRecord = yield (0, function_1.updateSocialTrek)(Object.assign(Object.assign({}, payload), { userId }));
                break;
            case 'refer':
                updatedRecord = yield (0, function_1.updateReferTrek)(Object.assign(Object.assign({}, payload), { userId }));
                break;
            case 'league':
                updatedRecord = yield (0, function_1.updateLeagueTrek)(Object.assign(Object.assign({}, payload), { userId }));
                break;
            default:
                break;
        }
        ;
        return (0, ResponseFormat_1.GenResObj)(Enum_1.HttpStatusCodes.OK, true, "Task info get successfully", updatedRecord);
    }
    catch (error) {
        console.log("Getting error for getting task info: " + error);
        return (0, ResponseFormat_1.GenResObj)(Enum_1.HttpStatusCodes.INTERNAL_SERVER, false, "Internal server error", null);
    }
});
exports.updateTaskStatus = updateTaskStatus;
