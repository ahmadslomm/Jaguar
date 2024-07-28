import { Schema, Model, model } from 'mongoose';
import { TUserModel } from '../utils/Types';


const userSchema = new Schema<TUserModel>(
    {
       firstName: {
        type : String,
       },
       lastName : {
        type : String
       },
       telegramId : {
        type : String,
        required: true
       },
    },
    {
        timestamps: true
    }
);

const collectionName = 'user';

const User = model<TUserModel>(collectionName, userSchema);

export default User;