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

