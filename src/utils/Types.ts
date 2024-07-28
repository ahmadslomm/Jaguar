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
    firstName:string;
    lastName : string;
    telegramId : string;
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
    status : String;
    minRequired : number;
    maxRequired : number;
    reward : number;
}

export type TStatusInfoModel = TStatusInfo & Document & SchemaTimestampsConfig;

//*********** User token Info *********** //
export type TUserTokenInfo = {
    userId : ObjectId;
    turnOverBalance: number;
    currentBalance: number;
    totalTankCapacity: number;
    currentTankBalance: number;
    levelId : ObjectId;
    multiTapLevel : string;
    energyTankLevel : string;
    energyChargingLevel : string;
    statusId : ObjectId;
    tankUpdateTime: Date;
    lastRewardDate: Date;
    lastRewardAmount: number;
    dailyChargingBooster : number;
    dailyTappingBoosters : number;
};

export type TUserTokenInfoModel = TUserTokenInfo & Document & SchemaTimestampsConfig


// *********** Multi Tap  Level*********** //
export type TMultiTapLevel = {
    level: number;
    levelName: string;
    tap: number;
    amount: number;
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