import { TUserTokenInfo } from '../utils/Types';
import { Table, Column, Model, DataType, ForeignKey, PrimaryKey } from 'sequelize-typescript';
import { User } from './user.schema';
import { StatusInfo } from './statusInfo.schema';

@Table({ tableName: 'userTokenInfo', timestamps: false })
export class UserTokenInfo extends Model<TUserTokenInfo> {

    @PrimaryKey
    @Column({type: DataType.UUID, defaultValue : DataType.UUIDV4,primaryKey: true})
    id!: string;

    @ForeignKey(() => User)
    @Column({ type: DataType.UUID, allowNull: false })
    userId!: string;

    @Column({ type: DataType.INTEGER, allowNull: false, defaultValue: 0 })
    turnOverBalance!: number;

    @Column({ type: DataType.INTEGER, allowNull: false, defaultValue: 0 })
    currentBalance!: number;

    @Column({ type: DataType.INTEGER, allowNull: false, defaultValue: 0 })
    totalTankCapacity!: number;

    @Column({ type: DataType.INTEGER, allowNull: false, defaultValue: 0 })
    currentTankBalance!: number;

    // @ForeignKey(() => LevelInfo)
    // @Column({ type: DataType.INTEGER })
    // levelId?: number;

    @Column({ type: DataType.STRING })
    multiTapLevel?: string;

    @Column({ type: DataType.STRING })
    energyTankLevel?: string;

    @Column({ type: DataType.STRING })
    energyChargingLevel?: string;

    @ForeignKey(() => StatusInfo)
    @Column({ type: DataType.UUID })
    statusId?: string;

    @Column({ type: DataType.DATE })
    tankUpdateTime?: Date;

    @Column({ type: DataType.DATE })
    lastRewardDate?: Date;

    @Column({ type: DataType.INTEGER })
    lastRewardAmount?: number;

    @Column({ type: DataType.INTEGER, defaultValue: 7 })
    dailyChargingBooster!: number;

    @Column({ type: DataType.INTEGER, defaultValue: 7 })
    dailyTappingBoosters!: number;
}
















// import { Schema, Model, model }  from 'mongoose';

// const userTokenInfoSchema = new Schema<TUserTokenInfoModel>(
//     {
//         userId : {
//             type : Schema.Types.ObjectId,
//             required : true
//         },
//         turnOverBalance : {
//             type : Number,
//             required : true,
//             default : 0
//         },
//         currentBalance : {
//             type : Number,
//             required : true,
//             default : 0
//         },
//         totalTankCapacity : {
//             type : Number,
//             required : true,
//             default : 0
//         },
//         currentTankBalance : {
//             type : Number,
//             required : true,
//             default : 0
//         },
//         levelId : {
//             type : Schema.Types.ObjectId,
//             ref : 'levelInfo'
//         },
//         multiTapLevel : {
//             type : String,
//             ref : 'multiTapLevel'
//         },
//         energyTankLevel : {
//             type : String,
//             ref : 'energyTankLevel'
//         },
//         energyChargingLevel : {
//             type : String,
//             ref : 'energyChargingLevel'
//         },
//         statusId : {
//             type : Schema.Types.ObjectId,
//             ref : 'statusInfo'
//         },
//         tankUpdateTime : {
//             type : Date,
//         },
//         lastRewardDate : {
//             type : Date,
//         },
//         lastRewardAmount : {
//             type : Number,
//         },
//         dailyChargingBooster : {
//             type : Number,
//             default : 7
//         },
//         dailyTappingBoosters : {
//             type : Number, 
//             default : 7
//         }
//     }
// );

// const collectionName = 'userTokenInfo';

// const UserTokenInfo = model<TUserTokenInfoModel>(collectionName, userTokenInfoSchema);

// export default UserTokenInfo;
