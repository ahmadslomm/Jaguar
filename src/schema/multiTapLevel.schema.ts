import { TMultiTapLevel } from '../utils/Types';

import { Table, Column, Model, DataType, CreatedAt, UpdatedAt, PrimaryKey } from 'sequelize-typescript';


@Table({ tableName: 'multiTapLevel', timestamps: true })
export class MultiTapLevel extends Model<TMultiTapLevel> {

    @PrimaryKey
    @Column({type: DataType.UUID, defaultValue : DataType.UUIDV4,primaryKey: true})
    id!: string;
    
    @Column({ type: DataType.INTEGER, allowNull: false })
    level!: number;

    @Column({ type: DataType.STRING, allowNull: false })
    levelName!: string;

    @Column({ type: DataType.INTEGER, allowNull: false })
    tap!: number;

    @Column({ type: DataType.INTEGER, allowNull: false })
    amount!: number;

    @CreatedAt
    @Column({ type: DataType.DATE })
    createdAt?: Date;

    @UpdatedAt
    @Column({ type: DataType.DATE })
    updatedAt?: Date;

    toJSON() {
        const attributes: any = Object.assign({}, this.get());
        delete attributes.createdAt;
        delete attributes.updatedAt;
        return attributes;
    }
}




// import { Schema, Model, model } from 'mongoose';

// const multiTapLevelSchema = new Schema<TMultiTapLevelModel>(
//     {
//         level : {
//             type : Number,
//             required : true
//         },
//         levelName : {
//             type : String,
//             required : true
//         },
//         tap : {
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

// multiTapLevelSchema.set("toJSON", {
//     virtuals: true,
//     transform: (doc, ret, options) => {
//         delete ret.__v;
//         delete ret.id;
//         delete ret.createdAt;
//         delete ret.updatedAt;
//     },
// });


// const collectionName = 'multiTapLevel';

// const MultiTapLevel = model<TMultiTapLevelModel>(collectionName, multiTapLevelSchema);

// export default MultiTapLevel;