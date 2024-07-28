import { Schema, Model, model } from 'mongoose';
import { TEnergyTankLevelModel } from '../utils/Types';

const enegryTankLevelSchema = new Schema<TEnergyTankLevelModel>(
    {
        level : {
            type : Number,
            required : true
        },
        levelName : {
            type : String,
            required : true
        },
        tankCapacity : {
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

enegryTankLevelSchema.set("toJSON", {
    virtuals: true,
    transform: (doc, ret, options) => {
        delete ret.__v;
        delete ret.id;
        delete ret.createdAt;
        delete ret.updatedAt;
    },
});

const collectionName = 'energyTankLevel';

const EnergyTankLevel = model<TEnergyTankLevelModel>(collectionName, enegryTankLevelSchema);

export default EnergyTankLevel;