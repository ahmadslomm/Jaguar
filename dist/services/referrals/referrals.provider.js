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
exports.claimReferralAmount = exports.getReferralInfo = void 0;
const user_schema_1 = require("../../schema/user.schema");
const statusInfo_schema_1 = require("../../schema/statusInfo.schema");
const userTokenInfo_schema_1 = require("../../schema/userTokenInfo.schema");
const Enum_1 = require("../../utils/Enum");
const ResponseFormat_1 = require("../../utils/ResponseFormat");
const sequelize_1 = require("sequelize");
const referralClaim_schema_1 = require("../../schema/referralClaim.schema");
const getReferralInfo = (req) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { telegramId } = req;
        const user = yield user_schema_1.User.findOne({ where: { telegramId: telegramId } });
        console.log("USer", user);
        const referralCode = user === null || user === void 0 ? void 0 : user.referralCode;
        const invitationLink = `${process.env.REFERRAL_URL}?referralCode=${referralCode}`;
        const referralClaims = yield referralClaim_schema_1.ReferralClaim.findAll({
            where: { referrerId: user === null || user === void 0 ? void 0 : user.id },
            attributes: ["id", "referralAmount", "claimed"],
            include: [
                {
                    model: user_schema_1.User,
                    as: "referredUser",
                    attributes: ["firstName", "lastName"],
                    include: [
                        {
                            model: userTokenInfo_schema_1.UserTokenInfo,
                            attributes: ["statusId"],
                            include: [
                                {
                                    model: statusInfo_schema_1.StatusInfo,
                                    attributes: ["status"],
                                },
                            ],
                        },
                    ],
                },
            ],
        });
        let totalCoin = 0;
        const formattedReferralClaims = referralClaims.map((referralClaim) => {
            // console.dir(referralClaim.referredUser.userTokenInfos[0], { depth : null} )
            const { firstName, lastName } = referralClaim.referredUser;
            const status = referralClaim.referredUser.userTokenInfos.length > 0
                ? referralClaim.referredUser.userTokenInfos[0].statusInfo.status
                : null;
            totalCoin = totalCoin + referralClaim.referralAmount;
            return {
                name: `${firstName} ${lastName} `,
                level: status,
                coins: referralClaim.referralAmount,
                // id: referralClaim.id,
                // referralAmount: referralClaim.referralAmount,
                // claimed: referralClaim.claimed,
                // referredUser: {
                //   firstName,
                //   lastName,
                //   status,
                // },
            };
        });
        const formattedResponse = {
            invitationLink,
            teamTotalCoins: totalCoin,
            team: formattedReferralClaims
        };
        return (0, ResponseFormat_1.GenResObj)(Enum_1.HttpStatusCodes.OK, true, "Referral info fetched successfully", formattedResponse);
    }
    catch (error) {
        console.log("Getting error for getting referral info: " + error);
        return (0, ResponseFormat_1.GenResObj)(Enum_1.HttpStatusCodes.INTERNAL_SERVER, false, "Internal server error", null);
    }
});
exports.getReferralInfo = getReferralInfo;
const claimReferralAmount = (req) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { telegramId } = req;
        const { referralRecordId } = req.body;
        const checkAvlReferralRecord = yield referralClaim_schema_1.ReferralClaim.findOne({
            where: { id: referralRecordId },
        });
        if (checkAvlReferralRecord === null || checkAvlReferralRecord === void 0 ? void 0 : checkAvlReferralRecord.claimed)
            return (0, ResponseFormat_1.GenResObj)(Enum_1.HttpStatusCodes.BAD_REQUEST, false, "Referral amount already claimed", null);
        if (checkAvlReferralRecord) {
            const referralClaim = yield referralClaim_schema_1.ReferralClaim.update({ claimed: true, referralStatus: "CLAIMED" }, { where: { id: referralRecordId } });
            const updateUserTokenInfo = yield userTokenInfo_schema_1.UserTokenInfo.update({
                currentBalance: (0, sequelize_1.literal)(`currentBalance + ${checkAvlReferralRecord.referralAmount}`),
                turnOverBalance: (0, sequelize_1.literal)(`turnOverBalance + ${checkAvlReferralRecord.referralAmount}`),
            }, { where: { userId: checkAvlReferralRecord.referrerId } });
            return (0, ResponseFormat_1.GenResObj)(Enum_1.HttpStatusCodes.OK, true, "Referral amount claimed successfully", referralClaim);
        }
        return (0, ResponseFormat_1.GenResObj)(Enum_1.HttpStatusCodes.NOT_FOUND, false, "Something went wrong");
    }
    catch (error) {
        console.log("Getting error for claiming referral amount :", error);
        return (0, ResponseFormat_1.GenResObj)(Enum_1.HttpStatusCodes.INTERNAL_SERVER, false, "Internal server error", null);
    }
});
exports.claimReferralAmount = claimReferralAmount;
