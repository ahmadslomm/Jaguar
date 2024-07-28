import { Schema, Model, model } from 'mongoose';
import { TStatusInfoModel } from '../utils/Types';

const statusInfoSchema = new Schema<TStatusInfoModel>(
    {
        status : {
            type : String,
            required : true
        },
        minRequired : {
            type : Number,
            required : true
        },
        maxRequired : {
            type : Number,
            required : true
        },
        reward : {
            type : Number
        }
    },
    {
        timestamps : true
    }
);

const collectionName = 'statusInfo';

const statusInfoModel = model<TStatusInfoModel>(collectionName, statusInfoSchema);

export default statusInfoModel;