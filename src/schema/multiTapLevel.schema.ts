import { Schema, Model, model } from 'mongoose';
import { TMultiTapLevelModel } from '../utils/Types';

const multiTapLevelSchema = new Schema<TMultiTapLevelModel>(
    {
        level : {
            type : Number,
            required : true
        },
        levelName : {
            type : String,
            required : true
        },
        tap : {
            type : Number,
            required : true
        }, 
        amount : {
            type : Number,
            required : true
        }
    },
    {
        timestamps : true
    }
);

multiTapLevelSchema.set("toJSON", {
    virtuals: true,
    transform: (doc, ret, options) => {
        delete ret.__v;
        delete ret.id;
        delete ret.createdAt;
        delete ret.updatedAt;
    },
});


const collectionName = 'multiTapLevel';

const MultiTapLevel = model<TMultiTapLevelModel>(collectionName, multiTapLevelSchema);

export default MultiTapLevel;