import { TStatusInfo } from '../utils/Types';

import { Table, Column, Model, DataType, CreatedAt, UpdatedAt, PrimaryKey } from 'sequelize-typescript';

export interface IStatusInfoAttributes {
    id?: number;
    status: string;
    minRequired: number;
    maxRequired: number;
    reward?: number;
    createdAt?: Date;
    updatedAt?: Date;
}

@Table({ tableName: 'statusInfo', timestamps: true })
export class StatusInfo extends Model<TStatusInfo> {
    @PrimaryKey
    @Column({type: DataType.UUID, defaultValue : DataType.UUIDV4,primaryKey: true})
    id!: string;
    
    @Column({ type: DataType.STRING, allowNull: false })
    status!: string;

    @Column({ type: DataType.INTEGER, allowNull: false })
    minRequired!: number;

    @Column({ type: DataType.INTEGER, allowNull: false })
    maxRequired!: number;

    @Column({ type: DataType.INTEGER, allowNull: true })
    reward?: number;

    @CreatedAt
    @Column({ type: DataType.DATE })
    createdAt?: Date;

    @UpdatedAt
    @Column({ type: DataType.DATE })
    updatedAt?: Date;
}






// import { Schema, Model, model } from 'mongoose';

// const statusInfoSchema = new Schema<TStatusInfoModel>(
//     {
//         status : {
//             type : String,
//             required : true
//         },
//         minRequired : {
//             type : Number,
//             required : true
//         },
//         maxRequired : {
//             type : Number,
//             required : true
//         },
//         reward : {
//             type : Number
//         }
//     },
//     {
//         timestamps : true
//     }
// );

// const collectionName = 'statusInfo';

// const statusInfoModel = model<TStatusInfoModel>(collectionName, statusInfoSchema);

// export default statusInfoModel;