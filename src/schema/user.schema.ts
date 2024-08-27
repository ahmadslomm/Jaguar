import { TUser } from '../utils/Types';
import { Table, Column, Model, DataType, PrimaryKey, AutoIncrement, CreatedAt, UpdatedAt, BeforeCreate, HasMany, HasOne } from 'sequelize-typescript';
import { UserTokenInfo } from './userTokenInfo.schema';
import { UserFlipTokenInfo } from './userFlipTokenInfo.schema';



  @Table({ tableName: 'user', timestamps: true })
  export class User extends Model<TUser> {
  
      @PrimaryKey
      @Column({type: DataType.UUID, defaultValue : DataType.UUIDV4,primaryKey: true})
      declare id: string;
  
      @Column(DataType.STRING)
      firstName?: string;
  
      @Column(DataType.STRING)
      lastName?: string;
  
      @Column({ type: DataType.STRING, allowNull: false })
      telegramId?: string;

      @Column({ type: DataType.STRING, allowNull: false})
      referralCode!: string;
    
      @Column({type : DataType.UUID})
      referredBy?: string;    
  
      @CreatedAt
      @Column({ type: DataType.DATE })
      declare createdAt?: Date;
  
      @UpdatedAt
      @Column({ field: 'updated_at', type: DataType.DATE })
      declare updatedAt?: Date;

      @HasMany(() => UserTokenInfo, 'userId')
      userTokenInfos!: UserTokenInfo[];

      @HasOne(() => UserFlipTokenInfo)
      userFlipTokenInfo!: UserFlipTokenInfo

//       @BeforeCreate
//   static generateReferralCode(instance: User) {
//     instance.referralCode = uuidv4();
//   }
  }
  






function uuidv4(): string {
    throw new Error('Function not implemented.');
}
// import { Schema, Model, model } from 'mongoose';


// const userSchema = new Schema<TUserModel>(
//     {
//        firstName: {
//         type : String,
//        },
//        lastName : {
//         type : String
//        },
//        telegramId : {
//         type : String,
//         required: true
//        },
//     },
//     {
//         timestamps: true
//     }
// );

// const collectionName = 'user';

// const User = model<TUserModel>(collectionName, userSchema);

// export default User;