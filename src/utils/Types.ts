import { Document, Schema, SchemaTimestampsConfig } from "mongoose";


// *********** User Model *********** //
export type TUser = {
    phone:string;
    name : string;
    email : string;
};

export type TUserModel = TUser & Document & SchemaTimestampsConfig;
// *********** User Model *********** //

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
// ***********Gen Res Obj *********** //