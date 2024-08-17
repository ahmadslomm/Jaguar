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
exports.updateTankCapacity = exports.calculateEnergyTankBalance = exports.createUser = void 0;
exports.getSocialMediaTrekInfo = getSocialMediaTrekInfo;
exports.getReferralTrekInfo = getReferralTrekInfo;
exports.getLeagueTrekInfo = getLeagueTrekInfo;
exports.updateSocialTrek = updateSocialTrek;
exports.updateReferTrek = updateReferTrek;
exports.updateLeagueTrek = updateLeagueTrek;
exports.updateLeagueLevel = updateLeagueLevel;
const user_schema_1 = require("../schema/user.schema");
const levelInfo_schema_1 = __importDefault(require("../schema/levelInfo.schema"));
const statusInfo_schema_1 = require("../schema/statusInfo.schema");
const userTokenInfo_schema_1 = require("../schema/userTokenInfo.schema");
const multiTapLevel_schema_1 = require("../schema/multiTapLevel.schema");
const energyTankLevel_schema_1 = require("../schema/energyTankLevel.schema");
const energyChargingLevel_schema_1 = require("../schema/energyChargingLevel.schema");
const referralClaim_schema_1 = require("../schema/referralClaim.schema");
const socialMediaTrek_schema_1 = require("../schema/socialMediaTrek.schema");
const referralTrek_schema_1 = require("../schema/referralTrek.schema");
const leagueTrek_schema_1 = require("../schema/leagueTrek.schema");
const sequelize_1 = require("sequelize");
// ******************* Register User For Server-side Bot Request******************* //
// export const registerUser = async (userInfo: TTelegramUserInfo) => {
//   try {
//     const { first_name, last_name, id } = userInfo;
//     const user = await User.findOneAndUpdate(
//       { telegramId: id },
//       { telegramId: id, firstName: first_name, lastName: last_name },
//       { upsert: true, new: true }
//     );
//     if (user) {
//       return true;
//     }
//     return false;
//   } catch (error) {
//     return false;
//   }
// };
// ******************* Create User With Status and different Level ID *******************
const createUser = (userInfo) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { firstName, lastName, telegramId, referralCode } = userInfo;
        //   const levelInfo = {levelName :'LEVEL-1'};
        const levelInfo = yield levelInfo_schema_1.default.findOne({
            where: { levelName: "LEVEL-1" },
        });
        //   const multiTapLevel = {levelName :'LEVEL-1'}
        const multiTapLevel = yield multiTapLevel_schema_1.MultiTapLevel.findOne({
            where: { levelName: "LEVEL-1" },
            attributes: ["id", "levelName"],
        });
        //   const energyTankLevel ={levelName :  'LEVEL-1', tankCapacity : 500}
        const energyTankLevel = yield energyTankLevel_schema_1.EnergyTankLevel.findOne({
            where: { levelName: "LEVEL-1" },
            attributes: ["id", "levelName", "tankCapacity"],
        });
        //   const energyChargingLevel = {levelName :'LEVEL-1'}
        const energyChargingLevel = yield energyChargingLevel_schema_1.EnergyChargingLevel.findOne({
            where: { levelName: "LEVEL-1" },
            attributes: ["id", "levelName"],
        });
        const statusInfo = yield statusInfo_schema_1.StatusInfo.findOne({ where: { minRequired: 0 } });
        const referredByUser = referralCode
            ? yield user_schema_1.User.findOne({ where: { referralCode: referralCode } })
            : null;
        const referralCodeToStore = generateReferralCode(telegramId.toString());
        const createdUser = yield user_schema_1.User.create({
            telegramId,
            firstName,
            lastName,
            referralCode: referralCodeToStore,
            referredBy: referredByUser ? referredByUser.id : null,
        });
        if (referredByUser) {
            yield referralClaim_schema_1.ReferralClaim.create({
                referrerId: referredByUser.id,
                referredUserId: createdUser.id,
                claimed: true,
                referralAmount: process.env.SIGNUP_REFERRAL_AMOUNT,
                referralStatus: "CLAIMED",
            });
            yield userTokenInfo_schema_1.UserTokenInfo.update({
                currentBalance: (0, sequelize_1.literal)(`currentBalance + ${process.env.SIGNUP_REFERRAL_AMOUNT}`),
                turnOverBalance: (0, sequelize_1.literal)(`turnOverBalance + ${process.env.SIGNUP_REFERRAL_AMOUNT}`),
            }, { where: { userId: referredByUser === null || referredByUser === void 0 ? void 0 : referredByUser.id } });
            const totalCount = yield referralClaim_schema_1.ReferralClaim.count({
                where: { referrerId: referredByUser.id, claimed: true },
            });
            //Update the refferel count of the referred user
            updateRefferelCount(referredByUser === null || referredByUser === void 0 ? void 0 : referredByUser.id, totalCount);
        }
        // Create UserTokenInfo if user creation was successful
        if (createdUser && statusInfo) {
            const createUserTokenInfoData = {
                userId: createdUser.id, // Ensure this is correctly assigned
                statusId: statusInfo === null || statusInfo === void 0 ? void 0 : statusInfo.id, // Ensure this is correctly assigned
                totalTankCapacity: energyTankLevel === null || energyTankLevel === void 0 ? void 0 : energyTankLevel.tankCapacity, // Ensure this is correctly assigned
                multiTapLevel: multiTapLevel === null || multiTapLevel === void 0 ? void 0 : multiTapLevel.levelName, // Ensure this is correctly assigned
                energyTankLevel: energyTankLevel === null || energyTankLevel === void 0 ? void 0 : energyTankLevel.levelName, // Ensure this is correctly assigned
                energyChargingLevel: energyChargingLevel === null || energyChargingLevel === void 0 ? void 0 : energyChargingLevel.levelName, // Ensure this is correctly assigned
                tankUpdateTime: new Date(), // Current timestamp
                currentTankBalance: 500
                // ...(referredByUser && {
                //   turnOverBalance: process.env.SIGNUP_REFERRAL_AMOUNT,
                // }),
                // ...(referredByUser && {
                //   currentBalance: process.env.SIGNUP_REFERRAL_AMOUNT,
                // }),
            };
            const userTOkenInfoCreated = yield userTokenInfo_schema_1.UserTokenInfo.create(createUserTokenInfoData);
            const socialMediaTrek = yield socialMediaTrek_schema_1.SocialMediaTrek.create({
                userId: createdUser === null || createdUser === void 0 ? void 0 : createdUser.id,
            });
            const referralTrek = yield referralTrek_schema_1.ReferralTrek.create({
                userId: createdUser.id,
            });
            const leagueTrek = yield leagueTrek_schema_1.LeagueTrek.create({ userId: createdUser.id });
        }
    }
    catch (error) {
        console.error("Getting error for creating user with level and status:", error);
        throw error;
    }
});
exports.createUser = createUser;
// ******************* Calculation for energy tank balance ******************* //
const calculateEnergyTankBalance = (userId) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        console.log("userID: " + userId);
        const userTokenInfo = yield userTokenInfo_schema_1.UserTokenInfo.findOne({
            where: {
                userId,
            },
            raw: true,
        });
        const getEnergyTankLevel = yield energyTankLevel_schema_1.EnergyTankLevel.findOne({
            where: {
                levelName: userTokenInfo === null || userTokenInfo === void 0 ? void 0 : userTokenInfo.energyTankLevel,
            },
        });
        const getEnergyChargingLevel = yield energyChargingLevel_schema_1.EnergyChargingLevel.findOne({
            where: {
                levelName: userTokenInfo === null || userTokenInfo === void 0 ? void 0 : userTokenInfo.energyChargingLevel,
            },
        });
        const currentTime = new Date();
        let lastUpdateTime = userTokenInfo === null || userTokenInfo === void 0 ? void 0 : userTokenInfo.tankUpdateTime;
        let updateFiled = { tankUpdateTime: currentTime };
        // console.log("0000000000", userTokenInfo?.totalTankCapacity, userTokenInfo?.currentTankBalance)
        console.log("Getting the last update time for ", new Date(), lastUpdateTime, currentTime);
        if (lastUpdateTime) {
            const lastUpdateDate = new Date(lastUpdateTime).setHours(0, 0, 0, 0);
            const currentDate = new Date(currentTime).setHours(0, 0, 0, 0);
            if (typeof lastUpdateTime === "string") {
                lastUpdateTime = new Date(lastUpdateTime);
            }
            //   console.log("Getting dates : ", lastUpdateDate, currentDate )
            lastUpdateDate !== currentDate &&
                (updateFiled["dailyChargingBooster"] = 7);
            lastUpdateDate !== currentDate &&
                (updateFiled["dailyTappingBoosters"] = 7);
            // console.log("userTOkenInfooooo", userTokenInfo);
            //check to update the current balance
            if ((userTokenInfo === null || userTokenInfo === void 0 ? void 0 : userTokenInfo.totalTankCapacity) > (userTokenInfo === null || userTokenInfo === void 0 ? void 0 : userTokenInfo.currentTankBalance)) {
                const timeDifference = currentTime.getTime() - (lastUpdateTime === null || lastUpdateTime === void 0 ? void 0 : lastUpdateTime.getTime());
                const timeDifferenceInSeconds = Math.floor(timeDifference / 1000);
                // console.log("Getting the second difference in seconds for ",timeDifferenceInSeconds)
                const tankBalanceToAdd = (userTokenInfo === null || userTokenInfo === void 0 ? void 0 : userTokenInfo.currentTankBalance) +
                    timeDifferenceInSeconds * (getEnergyChargingLevel === null || getEnergyChargingLevel === void 0 ? void 0 : getEnergyChargingLevel.chargingSpeed);
                // console.log("2222", tankBalanceToAdd)
                const updatedTankBalance = tankBalanceToAdd >= (userTokenInfo === null || userTokenInfo === void 0 ? void 0 : userTokenInfo.totalTankCapacity)
                    ? userTokenInfo === null || userTokenInfo === void 0 ? void 0 : userTokenInfo.totalTankCapacity
                    : tankBalanceToAdd;
                updateFiled["currentTankBalance"] = updatedTankBalance;
            }
            // console.log("3333333", updatedTankBalance)
            // console.log("4444444", updateUserTokenInfo)
        }
        // console.log(
        //   "Getting the updatedFiled ********************************",
        //   updateFiled
        // );
        const userTokenInfoForUpdate = yield userTokenInfo_schema_1.UserTokenInfo.findOne({
            where: { userId },
        });
        if (userTokenInfo) {
            yield (userTokenInfoForUpdate === null || userTokenInfoForUpdate === void 0 ? void 0 : userTokenInfoForUpdate.update(updateFiled));
            yield (userTokenInfoForUpdate === null || userTokenInfoForUpdate === void 0 ? void 0 : userTokenInfoForUpdate.reload());
            //   console.log('Updated UserTokenInfo:', userTokenInfo);
            return;
        }
    }
    catch (error) {
        console.log("Getting error for calculating energy tank balance : ", error);
        throw error;
    }
});
exports.calculateEnergyTankBalance = calculateEnergyTankBalance;
//******************* Generate Refferal Code *******************
function generateReferralCode(telegramId) {
    const chars = "ABCDEFGHIJKLMNPQRSTUVWXYZ"; // Omitted O for better distinction
    const digits = "0123456789";
    let referralCode = "";
    for (let i = 0; i < telegramId.length; i++) {
        if (i % 2 === 0) {
            referralCode += chars[parseInt(telegramId[i], 10)];
        }
        else {
            referralCode += digits[parseInt(telegramId[i], 10)];
        }
    }
    return referralCode ? referralCode : undefined;
}
//******************* Get Social Media Trek Info ******************* //
const updateTankCapacity = (userId) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const checkAvlUserTokenInfo = yield userTokenInfo_schema_1.UserTokenInfo.findOne({
            where: { userId: userId },
            raw: true,
        });
        const checkAvlEnergyTanKLevel = yield energyTankLevel_schema_1.EnergyTankLevel.findOne({
            where: { levelName: checkAvlUserTokenInfo === null || checkAvlUserTokenInfo === void 0 ? void 0 : checkAvlUserTokenInfo.energyTankLevel },
        });
        const updatedTankCapacity = yield userTokenInfo_schema_1.UserTokenInfo.update({ currentTankBalance: checkAvlEnergyTanKLevel === null || checkAvlEnergyTanKLevel === void 0 ? void 0 : checkAvlEnergyTanKLevel.tankCapacity }, { where: { userId } });
        return updatedTankCapacity;
    }
    catch (error) { }
});
exports.updateTankCapacity = updateTankCapacity;
//******************* Get Social Media Trek Info ******************* //
function getSocialMediaTrekInfo(userId) {
    return __awaiter(this, void 0, void 0, function* () {
        const checkAvlSocialMediaTrek = yield socialMediaTrek_schema_1.SocialMediaTrek.findOne({
            where: { userId },
        });
        const socialMediaTasks = [
            {
                type: "FollowonTwitter",
                name: "Follow on Twitter",
                follow: checkAvlSocialMediaTrek === null || checkAvlSocialMediaTrek === void 0 ? void 0 : checkAvlSocialMediaTrek.followTwitter,
                claimed: checkAvlSocialMediaTrek === null || checkAvlSocialMediaTrek === void 0 ? void 0 : checkAvlSocialMediaTrek.followTwitterClaimed,
            },
            // {
            //   type: "JoinTwitter",
            //   follow: checkAvlSocialMediaTrek?.joinTwitter,
            //   claimed: checkAvlSocialMediaTrek?.joinTwitterClaimed,
            // },
            {
                type: "FollowonInstagram",
                name: "Follow on Instagram",
                follow: checkAvlSocialMediaTrek === null || checkAvlSocialMediaTrek === void 0 ? void 0 : checkAvlSocialMediaTrek.followInstagram,
                claimed: checkAvlSocialMediaTrek === null || checkAvlSocialMediaTrek === void 0 ? void 0 : checkAvlSocialMediaTrek.followInstagramClaimed,
            },
            // {
            //   type: "JoinInstagram",
            //   follow: checkAvlSocialMediaTrek?.joinInstagram,
            //   claimed: checkAvlSocialMediaTrek?.joinInstagramClaimed,
            // },
            // {
            //   type: "FollowonYouTube",
            //   follow: checkAvlSocialMediaTrek?.followYouTube,
            //   claimed: checkAvlSocialMediaTrek?.followYouTubeClaimed,
            // },
            {
                type: "JoinYouTube",
                name: "Join YouTube",
                follow: checkAvlSocialMediaTrek === null || checkAvlSocialMediaTrek === void 0 ? void 0 : checkAvlSocialMediaTrek.joinYouTube,
                claimed: checkAvlSocialMediaTrek === null || checkAvlSocialMediaTrek === void 0 ? void 0 : checkAvlSocialMediaTrek.joinYouTubeClaimed,
            },
            // {
            //   type: "FollowonTelegram",
            //   follow: checkAvlSocialMediaTrek?.followTelegram,
            //   claimed: checkAvlSocialMediaTrek?.followTelegramClaimed,
            // },
            {
                type: "JoinTelegram",
                name: "Join Telegram",
                follow: checkAvlSocialMediaTrek === null || checkAvlSocialMediaTrek === void 0 ? void 0 : checkAvlSocialMediaTrek.joinTelegram,
                claimed: checkAvlSocialMediaTrek === null || checkAvlSocialMediaTrek === void 0 ? void 0 : checkAvlSocialMediaTrek.joinTelegramClaimed,
            },
        ];
        return socialMediaTasks.map((task) => (Object.assign(Object.assign({ type: task.type, name: task.name, coin: (checkAvlSocialMediaTrek === null || checkAvlSocialMediaTrek === void 0 ? void 0 : checkAvlSocialMediaTrek.amount) || 100000, follow: task.follow }, (!task.follow &&
            !task.claimed && { link: process.env.SOCIALMEDIA_LINK })), (task.follow && { claimed: task.claimed }))));
    });
}
//******************* Get Referral Trek Info ******************* //
function getReferralTrekInfo(userId) {
    return __awaiter(this, void 0, void 0, function* () {
        const checkAvlReferralTrek = yield referralTrek_schema_1.ReferralTrek.findOne({
            where: { userId },
        });
        const response = {
            refer: [
                (!(checkAvlReferralTrek === null || checkAvlReferralTrek === void 0 ? void 0 : checkAvlReferralTrek.claimedFor1Friends) && {
                    type: 1,
                    coin: checkAvlReferralTrek === null || checkAvlReferralTrek === void 0 ? void 0 : checkAvlReferralTrek.amountFor1Friends,
                    claim: checkAvlReferralTrek === null || checkAvlReferralTrek === void 0 ? void 0 : checkAvlReferralTrek.readyToClaimFor1Friends,
                    claimed: checkAvlReferralTrek === null || checkAvlReferralTrek === void 0 ? void 0 : checkAvlReferralTrek.claimedFor1Friends,
                }),
                (!(checkAvlReferralTrek === null || checkAvlReferralTrek === void 0 ? void 0 : checkAvlReferralTrek.claimedFor5Friends) && {
                    type: 5,
                    coin: checkAvlReferralTrek === null || checkAvlReferralTrek === void 0 ? void 0 : checkAvlReferralTrek.amountFor5Friends,
                    claim: checkAvlReferralTrek === null || checkAvlReferralTrek === void 0 ? void 0 : checkAvlReferralTrek.readyToClaimFor5Friends,
                    claimed: checkAvlReferralTrek === null || checkAvlReferralTrek === void 0 ? void 0 : checkAvlReferralTrek.claimedFor5Friends,
                }),
                (!(checkAvlReferralTrek === null || checkAvlReferralTrek === void 0 ? void 0 : checkAvlReferralTrek.claimedFor10Friends) && {
                    type: 10,
                    coin: checkAvlReferralTrek === null || checkAvlReferralTrek === void 0 ? void 0 : checkAvlReferralTrek.amountFor10Friends,
                    claim: checkAvlReferralTrek === null || checkAvlReferralTrek === void 0 ? void 0 : checkAvlReferralTrek.readyToClaimFor10Friends,
                    claimed: checkAvlReferralTrek === null || checkAvlReferralTrek === void 0 ? void 0 : checkAvlReferralTrek.claimedFor10Friends,
                }),
                (!(checkAvlReferralTrek === null || checkAvlReferralTrek === void 0 ? void 0 : checkAvlReferralTrek.claimedFor20Friends) && {
                    type: 20,
                    coin: checkAvlReferralTrek === null || checkAvlReferralTrek === void 0 ? void 0 : checkAvlReferralTrek.amountFor20Friends,
                    claim: checkAvlReferralTrek === null || checkAvlReferralTrek === void 0 ? void 0 : checkAvlReferralTrek.readyToClaimFor20Friends,
                    claimed: checkAvlReferralTrek === null || checkAvlReferralTrek === void 0 ? void 0 : checkAvlReferralTrek.claimedFor20Friends,
                }),
                (!(checkAvlReferralTrek === null || checkAvlReferralTrek === void 0 ? void 0 : checkAvlReferralTrek.claimedFor50Friends) && {
                    type: 50,
                    coin: checkAvlReferralTrek === null || checkAvlReferralTrek === void 0 ? void 0 : checkAvlReferralTrek.amountFor50Friends,
                    claim: checkAvlReferralTrek === null || checkAvlReferralTrek === void 0 ? void 0 : checkAvlReferralTrek.readyToClaimFor50Friends,
                    claimed: checkAvlReferralTrek === null || checkAvlReferralTrek === void 0 ? void 0 : checkAvlReferralTrek.claimedFor50Friends,
                }),
                (!(checkAvlReferralTrek === null || checkAvlReferralTrek === void 0 ? void 0 : checkAvlReferralTrek.claimedFor100Friends) && {
                    type: 100,
                    coin: checkAvlReferralTrek === null || checkAvlReferralTrek === void 0 ? void 0 : checkAvlReferralTrek.amountFor100Friends,
                    claim: checkAvlReferralTrek === null || checkAvlReferralTrek === void 0 ? void 0 : checkAvlReferralTrek.readyToClaimFor100Friends,
                    claimed: checkAvlReferralTrek === null || checkAvlReferralTrek === void 0 ? void 0 : checkAvlReferralTrek.claimedFor100Friends,
                }),
            ]
                .filter(Boolean)
                .slice(0, 5)
        };
        console.log("Geting for refere :::", response);
        return response;
    });
}
//******************* Get League Trek Info ******************* //
function getLeagueTrekInfo(userId, statusId) {
    return __awaiter(this, void 0, void 0, function* () {
        // Fetch the league trek info for the given user
        const checkAvlLeagueTrek = yield leagueTrek_schema_1.LeagueTrek.findOne({
            where: { userId },
        });
        const checkAvlStatusInfo = yield statusInfo_schema_1.StatusInfo.findOne({
            where: { id: statusId },
            attributes: ["status"],
        });
        if (!checkAvlLeagueTrek) {
            // Handle case where no data is found
            return { League: [] };
        }
        // Define the levels and their respective amount fields
        const levels = [
            {
                type: "Beginner",
                amountField: "amountForBeginner",
                readyToClaimField: "readyToClaimForBeginner",
                claimedField: "claimedForBeginner",
                minRequired: 0,
                maxRequired: 10000
            },
            {
                type: "Player",
                amountField: "amountForPlayer",
                readyToClaimField: "readyToClaimForPlayer",
                claimedField: "claimedForPlayer",
                minRequired: 10000,
                maxRequired: 50000
            },
            {
                type: "Fan",
                amountField: "amountForFan",
                readyToClaimField: "readyToClaimForFan",
                claimedField: "claimedForFan",
                minRequired: 50000,
                maxRequired: 100000
            },
            {
                type: "Gamer",
                amountField: "amountForGamer",
                readyToClaimField: "readyToClaimForGamer",
                claimedField: "claimedForGamer",
                minRequired: 100000,
                maxRequired: 500000
            },
            {
                type: "Expert",
                amountField: "amountForExpert",
                readyToClaimField: "readyToClaimForExpert",
                claimedField: "claimedForExpert",
                minRequired: 500000,
                maxRequired: 1000000
            },
        ];
        let currentFlagSet = false;
        const response = {
            League: levels.map((level) => {
                const isCurrentLevel = level.type === (checkAvlStatusInfo === null || checkAvlStatusInfo === void 0 ? void 0 : checkAvlStatusInfo.status);
                const currentFlag = currentFlagSet ? true : false;
                // If the current level is found and currentFlag hasn't been set yet
                if (!checkAvlLeagueTrek[level.claimedField]) {
                    if (isCurrentLevel && !currentFlagSet) {
                        currentFlagSet = true; // Set the flag to true for the next record
                        return {
                            type: level.type,
                            level: level.type,
                            coin: checkAvlLeagueTrek[level.amountField],
                            claim: checkAvlLeagueTrek[level.readyToClaimField],
                            claimed: checkAvlLeagueTrek[level.claimedField],
                            currentLevel: false,
                            // currentFlag: false, // No flag for the current level
                            minRequired: level.minRequired,
                            maxRequired: level.maxRequired,
                        };
                    }
                    if (!isCurrentLevel && currentFlagSet) {
                        currentFlagSet = false; // Set the flag to true for the next record
                        return {
                            type: level.type,
                            level: level.type,
                            coin: checkAvlLeagueTrek[level.amountField],
                            claim: checkAvlLeagueTrek[level.readyToClaimField],
                            claimed: checkAvlLeagueTrek[level.claimedField],
                            currentLevel: true,
                            // currentFlag: false, // No flag for the current level
                            minRequired: level.minRequired,
                            maxRequired: level.maxRequired,
                        };
                    }
                    // For all other records
                    return {
                        type: level.type,
                        level: level.type,
                        coin: checkAvlLeagueTrek[level.amountField],
                        claim: checkAvlLeagueTrek[level.readyToClaimField],
                        claimed: checkAvlLeagueTrek[level.claimedField],
                        currentLevel: false,
                        // currentFlag, // The next record after currentLevel will have currentFlag true
                        minRequired: level.minRequired,
                        maxRequired: level.maxRequired,
                    };
                }
                return null;
            }).filter(Boolean)
                .slice(0, 5)
        };
        return response;
    });
}
//******************* Update Social Media Trek Info ******************* //
function updateSocialTrek(data) {
    return __awaiter(this, void 0, void 0, function* () {
        const { userId, type, action } = data;
        const socialTrekList = [
            {
                type: "FollowonTwitter",
                action: "follow",
                fieldName: "followTwitter",
            },
            {
                type: "FollowonTwitter",
                action: "claim",
                fieldName: "followTwitterClaimed",
                amount: 100000,
            },
            {
                type: "JoinTwitter",
                action: "follow",
                fieldName: "joinTwitter",
            },
            {
                type: "JoinTwitter",
                action: "claim",
                fieldName: "joinTwitterClaimed",
                amount: 100000,
            },
            {
                type: "FollowonInstagram",
                action: "follow",
                fieldName: "followInstagram",
            },
            {
                type: "FollowonInstagram",
                action: "claim",
                fieldName: "followInstagramClaimed",
                amount: 100000,
            },
            {
                type: "JoinInstagram",
                action: "follow",
                fieldName: "joinInstagram",
            },
            {
                type: "JoinInstagram",
                action: "claim",
                fieldName: "joinInstagramClaimed",
                amount: 100000,
            },
            {
                type: "FollowonYouTube",
                action: "follow",
                fieldName: "followYouTube",
            },
            {
                type: "FollowonYouTube",
                action: "claim",
                fieldName: "followYouTubeClaimed",
                amount: 100000,
            },
            {
                type: "JoinYouTube",
                action: "follow",
                fieldName: "joinYouTube",
            },
            {
                type: "JoinYouTube",
                action: "claim",
                fieldName: "joinYouTubeClaimed",
                amount: 100000,
            },
            {
                type: "FollowonTelegram",
                action: "follow",
                fieldName: "followTelegram",
            },
            {
                type: "FollowonTelegram",
                action: "claim",
                fieldName: "followTelegramClaimed",
                amount: 100000,
            },
            {
                type: "JoinTelegram",
                action: "follow",
                fieldName: "joinTelegram",
            },
            {
                type: "JoinTelegram",
                action: "claim",
                fieldName: "joinTelegramClaimed",
                amount: 100000,
            },
        ];
        const field = socialTrekList.filter((item) => item.type === type && item.action === action)[0];
        if (!field) {
            return null;
            throw new Error("Invalid type or action");
        }
        // Determine the field name to update
        const fieldName = field.fieldName;
        const amount = field.amount;
        const updatedSocialMediaTrek = yield socialMediaTrek_schema_1.SocialMediaTrek.update({ [fieldName]: true }, // Assuming you want to set the field to true
        { where: { userId } });
        if (action == "claim") {
            yield userTokenInfo_schema_1.UserTokenInfo.update({
                currentBalance: (0, sequelize_1.literal)(`currentBalance + ${amount}`),
                turnOverBalance: (0, sequelize_1.literal)(`turnOverBalance + ${amount}`),
            }, { where: { userId } });
        }
        return updatedSocialMediaTrek;
    });
}
//******************* Update Referral Trek Info ******************* //
function updateReferTrek(data) {
    return __awaiter(this, void 0, void 0, function* () {
        const { userId, type, action } = data;
        const referTrekList = [
            {
                type: 1,
                action: "claim",
                fieldName: "claimedFor1Friends",
                amount: 10000,
            },
            {
                type: 5,
                action: "claim",
                fieldName: "claimedFor5Friends",
                amount: 500000,
            },
            {
                type: 10,
                action: "claim",
                fieldName: "claimedFor10Friends",
                amount: 1000000,
            },
            {
                type: 20,
                action: "claim",
                fieldName: "claimedFor20Friends",
                amount: 2000000,
            },
            {
                type: 50,
                action: "claim",
                fieldName: "claimedFor50Friends",
                amount: 5000000,
            },
            {
                type: 100,
                action: "claim",
                fieldName: "claimedFor100Friends",
                amount: 10000000,
            },
        ];
        const field = referTrekList.filter((item) => item.type === type && item.action === action)[0];
        console.log("field ********************************", field);
        if (!field) {
            return null;
        }
        const fieldName = field.fieldName;
        const amount = field.amount;
        const updatedReferralTrek = yield referralTrek_schema_1.ReferralTrek.update({ [fieldName]: true }, // Assuming you want to set the field to true
        { where: { userId } });
        yield userTokenInfo_schema_1.UserTokenInfo.update({
            currentBalance: (0, sequelize_1.literal)(`currentBalance + ${amount}`),
            turnOverBalance: (0, sequelize_1.literal)(`turnOverBalance + ${amount}`),
        }, { where: { userId } });
        return updatedReferralTrek;
    });
}
//******************* Update League Trek Info ******************* //
function updateLeagueTrek(data) {
    return __awaiter(this, void 0, void 0, function* () {
        const { userId, type, action } = data;
        const leagueTrekList = [
            {
                type: "Beginner",
                action: "claim",
                fieldName: "claimedForBeginner",
                amount: 2000,
            },
            {
                type: "Player",
                action: "claim",
                fieldName: "claimedForPlayer",
                amount: 5000,
            },
            { type: "Fan", action: "claim", fieldName: "claimedForFan", amount: 10000 },
            {
                type: "Gamer",
                action: "claim",
                fieldName: "claimedForGamer",
                amount: 50000,
            },
            {
                type: "Expert",
                action: "claim",
                fieldName: "claimedForExpert",
                amount: 100000,
            },
        ];
        const field = leagueTrekList.filter((item) => item.type === type && item.action === action)[0];
        if (!field) {
            return null;
        }
        const fieldName = field.fieldName;
        const amount = field.amount;
        const updatedLeagueTrek = yield leagueTrek_schema_1.LeagueTrek.update({ [fieldName]: true }, // Assuming you want to set the field to true
        { where: { userId } });
        yield userTokenInfo_schema_1.UserTokenInfo.update({
            currentBalance: (0, sequelize_1.literal)(`currentBalance + ${amount}`),
            turnOverBalance: (0, sequelize_1.literal)(`turnOverBalance + ${amount}`),
        }, { where: { userId } });
        return updatedLeagueTrek;
    });
}
//******************* Update Refferel Count ******************* //
function updateRefferelCount(userId, totalReferral) {
    return __awaiter(this, void 0, void 0, function* () {
        const referTrekList = [
            { type: 1, fieldName: "readyToClaimFor1Friends", amount: 10000 },
            { type: 5, fieldName: "readyToClaimFor5Friends", amount: 500000 },
            { type: 10, fieldName: "readyToClaimFor10Friends", amount: 1000000 },
            { type: 20, fieldName: "readyToClaimFor20Friends", amount: 2000000 },
            { type: 50, fieldName: "readyToClaimFor50Friends", amount: 5000000 },
            { type: 100, fieldName: "readyToClaimFor100Friends", amount: 10000000 },
        ];
        const referralTrek = yield referralTrek_schema_1.ReferralTrek.findOne({
            where: { userId: userId },
        });
        if (!referralTrek) {
            throw new Error(`ReferralTrek record not found for userId: ${userId}`);
        }
        // Update fields based on the totalReferral count
        for (const { type, fieldName } of referTrekList) {
            if (totalReferral >= type) {
                referralTrek[fieldName] = true; // Dynamically set field value to true
            }
        }
        // Save the updated record
        yield referralTrek.save();
    });
}
//******************* Check league/ status level and update it ******************* //
function updateLeagueLevel(telegramId) {
    return __awaiter(this, void 0, void 0, function* () {
        const checkAvlUser = yield user_schema_1.User.findOne({
            where: { telegramId },
        });
        if (!checkAvlUser) {
            return null;
        }
        const checkAvlUserTokenInfo = yield userTokenInfo_schema_1.UserTokenInfo.findOne({
            where: { userId: checkAvlUser === null || checkAvlUser === void 0 ? void 0 : checkAvlUser.id },
            attributes: ["currentBalance", "statusId", "turnOverBalance"],
        });
        console.log("Balance info: ", checkAvlUserTokenInfo);
        const checkAvlRequiredStatsInfo = yield statusInfo_schema_1.StatusInfo.findOne({
            where: {
                minRequired: {
                    [sequelize_1.Op.lte]: checkAvlUserTokenInfo === null || checkAvlUserTokenInfo === void 0 ? void 0 : checkAvlUserTokenInfo.turnOverBalance,
                },
                maxRequired: {
                    [sequelize_1.Op.gte]: checkAvlUserTokenInfo === null || checkAvlUserTokenInfo === void 0 ? void 0 : checkAvlUserTokenInfo.turnOverBalance,
                },
            },
        });
        console.log("heck ccccc", checkAvlRequiredStatsInfo);
        const updateStatus = yield userTokenInfo_schema_1.UserTokenInfo.update({ statusId: checkAvlRequiredStatsInfo === null || checkAvlRequiredStatsInfo === void 0 ? void 0 : checkAvlRequiredStatsInfo.id }, { where: { userId: checkAvlUser.id } });
        const leagueTrekList = [
            { type: "Beginner", fieldName: "readyToClaimForBeginner", amount: 2000 },
            { type: "Player", fieldName: "readyToClaimForPlayer", amount: 5000 },
            { type: "Fan", fieldName: "readyToClaimForFan", amount: 10000 },
            { type: "Gamer", fieldName: "readyToClaimForGamer", amount: 50000 },
            { type: "Expert", fieldName: "readyToClaimForExpert", amount: 100000 },
        ];
        const field = leagueTrekList.filter((item) => item.type === (checkAvlRequiredStatsInfo === null || checkAvlRequiredStatsInfo === void 0 ? void 0 : checkAvlRequiredStatsInfo.status))[0];
        if (!field) {
            return null;
        }
        const fieldName = field.fieldName;
        const updatedLeagueTrek = yield leagueTrek_schema_1.LeagueTrek.update({ [fieldName]: true }, { where: { userId: checkAvlUser.id } });
    });
}
