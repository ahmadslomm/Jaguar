import { TUser } from '../utils/Types';
import { Table, Column, Model, DataType, PrimaryKey, AutoIncrement, CreatedAt, UpdatedAt } from 'sequelize-typescript';



  @Table({ tableName: 'user', timestamps: true })
  export class User extends Model<TUser> {
  
      @PrimaryKey
      @Column({type: DataType.UUID, defaultValue : DataType.UUIDV4,primaryKey: true})
      id!: string;
  
      @Column(DataType.STRING)
      firstName?: string;
  
      @Column(DataType.STRING)
      lastName?: string;
  
      @Column({ type: DataType.STRING, allowNull: false, unique: true })
      telegramId?: string;
  
      @CreatedAt
      @Column({ type: DataType.DATE })
      createdAt?: Date;
  
      @UpdatedAt
      @Column({ field: 'updated_at', type: DataType.DATE })
      updatedAt?: Date;
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