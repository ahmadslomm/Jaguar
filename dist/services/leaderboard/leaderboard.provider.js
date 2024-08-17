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
exports.getLederBoardInfo = void 0;
const user_schema_1 = require("../../schema/user.schema");
const userTokenInfo_schema_1 = require("../../schema/userTokenInfo.schema");
const Enum_1 = require("../../utils/Enum");
const ResponseFormat_1 = require("../../utils/ResponseFormat");
const statusInfo_schema_1 = require("../../schema/statusInfo.schema");
const getLederBoardInfo = (req) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const { telegramId } = req;
        const user = yield user_schema_1.User.findOne({ where: { telegramId } });
        const checkAvlUserTokenInfo = yield userTokenInfo_schema_1.UserTokenInfo.findOne({ where: { userId: user === null || user === void 0 ? void 0 : user.id },
            attributes: ['statusId', 'currentBalance'],
            include: [
                {
                    model: statusInfo_schema_1.StatusInfo,
                    attributes: ['status']
                }
            ] });
        const topUserTokenInfos = yield userTokenInfo_schema_1.UserTokenInfo.findAll({
            attributes: ['id', 'userId', 'currentBalance'],
            include: [
                {
                    model: user_schema_1.User,
                    as: 'userInfo',
                    attributes: ['id', 'firstName', 'lastName']
                },
                {
                    model: statusInfo_schema_1.StatusInfo,
                    attributes: ['status']
                }
            ],
            order: [['currentBalance', 'DESC']],
            limit: 8
        });
        const teamData = topUserTokenInfos
            .filter(info => info.userId !== (user === null || user === void 0 ? void 0 : user.id))
            .map(info => {
            var _a, _b, _c;
            return ({
                name: `${(_a = info.userInfo) === null || _a === void 0 ? void 0 : _a.firstName}${(_b = info.userInfo) === null || _b === void 0 ? void 0 : _b.lastName}`,
                level: ((_c = info.statusInfo) === null || _c === void 0 ? void 0 : _c.status) || "Unknown",
                coins: info.currentBalance,
            });
        });
        const formattedResponse = {
            personalData: {
                name: `${user === null || user === void 0 ? void 0 : user.firstName}${user === null || user === void 0 ? void 0 : user.lastName}`,
                level: (_a = checkAvlUserTokenInfo === null || checkAvlUserTokenInfo === void 0 ? void 0 : checkAvlUserTokenInfo.statusInfo) === null || _a === void 0 ? void 0 : _a.status,
                coins: checkAvlUserTokenInfo === null || checkAvlUserTokenInfo === void 0 ? void 0 : checkAvlUserTokenInfo.currentBalance
            },
            teamData
        };
        return (0, ResponseFormat_1.GenResObj)(Enum_1.HttpStatusCodes.OK, true, "Learderboard details fetched successfully", formattedResponse);
    }
    catch (error) {
        console.log("Getting error for getting leaderboard info: " + error);
        return (0, ResponseFormat_1.GenResObj)(Enum_1.HttpStatusCodes.INTERNAL_SERVER, false, "Internal server error", null);
    }
});
exports.getLederBoardInfo = getLederBoardInfo;
