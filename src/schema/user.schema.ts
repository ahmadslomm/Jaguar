import { Schema, Model, model } from 'mongoose';
import { TUserModel } from '../utils/Types';


const userSchema = new Schema<TUserModel>(
    {
        phone : {
            type : String,
            required: true
        },
        email : {
            type : String
        },
       name : {
        type : String
       }
    },
    {
        timestamps: true
    }
);

const collectionName = 'user';

const User = model<TUserModel>(collectionName, userSchema);

export default User;