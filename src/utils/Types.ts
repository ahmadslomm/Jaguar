import { ObjectId } from "mongodb";
import { Document, Schema, SchemaTimestampsConfig } from "mongoose";


// ***********Gen Res Obj *********** //
export type TGenResObj = {
    success: boolean;
    message: string;
    data?: any;
};

export type TResponse = {
    code: number;
    data: TGenResObj;
};

// *********** User Model *********** //
export type TUser = {
    id?: number | string;
    firstName?: string;
    lastName?: string;
    telegramId?: string | undefined; 
    referralCode?: string;
    referredBy?: string | null;
};

export type TUserModel = TUser & Document & SchemaTimestampsConfig;

// *********** Telegrame USerInfo *********** //
export type TTelegramUserInfo = {
    id: number;
    is_bot: boolean;
    first_name: string;
    last_name: string;
    language_code: string;
};

// *********** LevelInfo *********** //
export type TLevelInfo = {
    level: number;
    levelName: string;
    tankCapacity: number;
    amount: number;
};

export type TLevelInfoModel = TLevelInfo & Document & SchemaTimestampsConfig ;

//*********** Status Info *********** //
export type TStatusInfo = {
    id?: string;
    status? : string;
    minRequired? : number;
    maxRequired? : number;
    reward? : number;
}

export type TStatusInfoModel = TStatusInfo & Document & SchemaTimestampsConfig;

//*********** User token Info *********** //
export type TUserTokenInfo = {
    userId : string;
    turnOverBalance: number;
    currentBalance: number;
    totalTankCapacity: number;
    currentTankBalance: number;
    levelId : ObjectId;
    multiTapLevel : string;
    energyTankLevel : string;
    energyChargingLevel : string;
    statusId : string;
    tankUpdateTime: Date;
    lastRewardDate: Date;
    lastRewardAmount: number;
    dailyChargingBooster : number;
    dailyTappingBoosters : number;
    dailyGammingLimit : number;
};

export type TUserTokenInfoModel = TUserTokenInfo & Document & SchemaTimestampsConfig


// *********** Multi Tap  Level*********** //
export type TMultiTapLevel = {
    id?: number | string;
    level?: number;
    levelName?: string;
    tap?: number;
    amount?: number;
};

export type TMultiTapLevelModel = TMultiTapLevel & Document & SchemaTimestampsConfig ;

// *********** Energy Tank Level *********** //
export type TEnergyTankLevel = {
    level: number;
    levelName: string;
    tankCapacity: number;
    amount: number;
};

export type TEnergyTankLevelModel = TEnergyTankLevel & Document & SchemaTimestampsConfig ;

// *********** Energy charging level *********** //
export type TEnergyChargingLevel = {
    level: number;
    levelName: string;
    chargingSpeed: number;
    amount: number;
};

export type TEnergyChargingLevelModel = TEnergyChargingLevel & Document & SchemaTimestampsConfig ;

// *********** REFERRAL Claim *********** //
export type TReferralClaim = {
    id?: string;
    referrerId: string;
    referredUserId: string;
    claimed: boolean;
    referralAmount: number;
    referralStatus: string;
};

// *********** Socialmedia Trek *********** //
export type TSocialMediaTrek = {
    id?: number;
    userId?: string;
    followTwitter?: boolean;
    followTwitterClaimed?: boolean; // Make these optional
    joinTwitter?: boolean;
    joinTwitterClaimed?: boolean;
    followYouTube?: boolean;
    followYouTubeClaimed?: boolean;
    joinYouTube?: boolean;
    joinYouTubeClaimed?: boolean;
    followInstagram?: boolean;
    followInstagramClaimed?: boolean;
    joinInstagram?: boolean;
    joinInstagramClaimed?: boolean;
    followTelegram?: boolean;
    followTelegramClaimed?: boolean;
    joinTelegram?: boolean;
    joinTelegramClaimed?: boolean;
    amount?: number;
};


// *********** Referral Trek *********** //
export type TReferralTrek = {
    id?: string;
    userId?: string;
    readyToClaimFor1Friend?: boolean;
    claimedFor1Friend?: boolean;
    amountFor1Friends?: number;
    readyToClaimFor5Friends?: boolean;
    claimedFor5Friends?: boolean;
    amountFor5Friends?: number;
    readyToClaimFor10Friends?: boolean;
    claimedFor10Friends?: boolean;
    amountFor10Friends?: number;
    readyToClaimFor20Friends?: boolean;
    claimedFor20Friends?: boolean;
    amountFor20Friends?: number;
    readyToClaimFor50Friends?: boolean;
    claimedFor50Friends?: boolean;
    amountFor50Friends?: number;
    readyToClaimFor100Friends?: boolean;
    claimedFor100Friends?: boolean;
    amountFor100Friends?: number;
};

// *********** League Trek *********** //
export type TLeagueTrek = {
    id?: string;
    userId?: string;
    readyToClaimForBeginner?: boolean;
    claimedForBeginner?: boolean;
    amountForBeginner?: number;
    readyToClaimForPlayer?: boolean;
    claimedForPlayer?: boolean;
    amountForPlayer?: number;
    readyToClaimForFan?: boolean;
    claimedForFan?: boolean;
    amountForFan?: number;
    readyToClaimForGamer?: boolean;
    claimedForGamer?: boolean;
    amountForGamer?: number;
    readyToClaimForExpert?: boolean;
    claimedForExpert?: boolean;
    amountForExpert?: number;
};

// *********** User Flip Token Info *********** //
export type TUserFlipTokenInfp = {
    id? : string;
    userId?: string;
    currentFlipTokens?: number;
}
