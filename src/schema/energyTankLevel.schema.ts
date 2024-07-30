import { TEnergyTankLevel } from '../utils/Types';

import { Table, Column, Model, DataType, CreatedAt, UpdatedAt, PrimaryKey } from 'sequelize-typescript';

@Table({ tableName: 'energyTankLevel', timestamps: true })
export class EnergyTankLevel extends Model<TEnergyTankLevel> {
   
    @PrimaryKey
    @Column({type: DataType.UUID, defaultValue : DataType.UUIDV4,primaryKey: true})
    id!: string;

    @Column({ type: DataType.INTEGER, allowNull: false })
    level!: number;

    @Column({ type: DataType.STRING, allowNull: false })
    levelName!: string;

    @Column({ type: DataType.INTEGER, allowNull: false })
    tankCapacity!: number;

    @Column({ type: DataType.INTEGER, allowNull: false })
    amount!: number;

    @CreatedAt
    @Column({ type: DataType.DATE })
    createdAt?: Date;

    @UpdatedAt
    @Column({ type: DataType.DATE })
    updatedAt?: Date;

    // Optional: Exclude fields from JSON response
    toJSON() {
        const attributes: any = Object.assign({}, this.get());
        delete attributes.createdAt;
        delete attributes.updatedAt;
        return attributes;
    }
}




// import { Schema, Model, model } from 'mongoose';

// const enegryTankLevelSchema = new Schema<TEnergyTankLevelModel>(
//     {
//         level : {
//             type : Number,
//             required : true
//         },
//         levelName : {
//             type : String,
//             required : true
//         },
//         tankCapacity : {
//             type : Number,
//             required : true
//         }, 
//         amount : {
//             type : Number,
//             required : true
//         }
//     },
//     {
//         timestamps : true
//     }
// );

// enegryTankLevelSchema.set("toJSON", {
//     virtuals: true,
//     transform: (doc, ret, options) => {
//         delete ret.__v;
//         delete ret.id;
//         delete ret.createdAt;
//         delete ret.updatedAt;
//     },
// });

// const collectionName = 'energyTankLevel';

// const EnergyTankLevel = model<TEnergyTankLevelModel>(collectionName, enegryTankLevelSchema);

// export default EnergyTankLevel;