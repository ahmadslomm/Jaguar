import { Schema, Model, model } from 'mongoose';
import { TEnergyChargingLevelModel } from '../utils/Types';

const energyChargingSchema = new Schema<TEnergyChargingLevelModel>(
    {
        level : {
            type : Number,
            required : true
        },
        levelName : {
            type : String,
            required : true
        },
        chargingSpeed : {
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

energyChargingSchema.set("toJSON", {
    virtuals: true,
    transform: (doc, ret, options) => {
        delete ret.__v;
        delete ret.id;
        delete ret.createdAt;
        delete ret.updatedAt;
    },
});

const collectionName = 'energyChargingLevel';

const energyChargingLevel = model<TEnergyChargingLevelModel>(collectionName, energyChargingSchema);

export default energyChargingLevel;