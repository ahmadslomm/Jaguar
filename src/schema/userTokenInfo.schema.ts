import { Schema, Model, model }  from 'mongoose';
import { TUserTokenInfoModel } from '../utils/Types';

const userTokenInfoSchema = new Schema<TUserTokenInfoModel>(
    {
        userId : {
            type : Schema.Types.ObjectId,
            required : true
        },
        turnOverBalance : {
            type : Number,
            required : true,
            default : 0
        },
        currentBalance : {
            type : Number,
            required : true,
            default : 0
        },
        totalTankCapacity : {
            type : Number,
            required : true,
            default : 0
        },
        currentTankBalance : {
            type : Number,
            required : true,
            default : 0
        },
        levelId : {
            type : Schema.Types.ObjectId,
            ref : 'levelInfo'
        },
        multiTapLevel : {
            type : String,
            ref : 'multiTapLevel'
        },
        energyTankLevel : {
            type : String,
            ref : 'energyTankLevel'
        },
        energyChargingLevel : {
            type : String,
            ref : 'energyChargingLevel'
        },
        statusId : {
            type : Schema.Types.ObjectId,
            ref : 'statusInfo'
        },
        tankUpdateTime : {
            type : Date,
        },
        lastRewardDate : {
            type : Date,
        },
        lastRewardAmount : {
            type : Number,
        },
        dailyChargingBooster : {
            type : Number,
            default : 7
        },
        dailyTappingBoosters : {
            type : Number, 
            default : 7
        }
    }
);

const collectionName = 'userTokenInfo';

const UserTokenInfo = model<TUserTokenInfoModel>(collectionName, userTokenInfoSchema);

export default UserTokenInfo;
