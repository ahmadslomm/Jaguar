import { Table, Column, Model, DataType, PrimaryKey, ForeignKey, BelongsTo, CreatedAt, UpdatedAt } from 'sequelize-typescript';
import { User } from './user.schema';

@Table({ tableName: 'referralClaims', timestamps: true })
export class ReferralClaim extends Model {
  @PrimaryKey
  @Column({ type: DataType.UUID, defaultValue: DataType.UUIDV4 })
  id!: string;

  //Person who is going to refer to other
  @ForeignKey(() => User)
  @Column({ type: DataType.UUID, allowNull: false })
  referrerId!: string;

  //Person who is referred by someone
  @ForeignKey(() => User)
  @Column({ type: DataType.UUID, allowNull: false })
  referredUserId!: string;

  @Column({ type: DataType.BOOLEAN, defaultValue: false })
  claimed!: boolean;

  @Column({ type : DataType.INTEGER, allowNull: false })
  referralAmount!: number;

  //status referralStatus enum : PENDING | CLAIMED//
  @Column({ type: DataType.STRING,})
  referralStatus!: number;

  @CreatedAt
  @Column({ type: DataType.DATE })
  createdAt?: Date;

  @UpdatedAt
  @Column({ type: DataType.DATE })
  updatedAt?: Date;

  // This creates a relation to the User model, indicating that the referrer is a User
  @BelongsTo(() => User, 'referrerId')
  referrer!: User;

  // This creates a relation to the User model, indicating that the referred user is also a User
  @BelongsTo(() => User, 'referredUserId')
  referredUser!: User;
};
