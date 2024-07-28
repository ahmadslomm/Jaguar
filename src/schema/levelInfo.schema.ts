import { Schema, Model, model } from 'mongoose';
import { TLevelInfoModel } from '../utils/Types';

const levelInfoSchema = new Schema<TLevelInfoModel>(
    {
        level : {
            type : Number,
            required : true
        },
        levelName : {
            type : String,
            required : true
        }
    },
    {
        timestamps : true
    }
);

const collectionName = 'levelInfo';

const LevelInfo = model<TLevelInfoModel>(collectionName, levelInfoSchema);

export default LevelInfo;