import { Table, Column, Model, DataType, PrimaryKey, ForeignKey, BelongsTo, CreatedAt, UpdatedAt } from 'sequelize-typescript';
import { User } from './user.schema';

@Table({ tableName: 'referralClaims', timestamps: true })
export class ReferralClaim extends Model {
  @PrimaryKey
  @Column({ type: DataType.UUID, defaultValue: DataType.UUIDV4 })
  declare id?: string;

  // Person who is going to refer to others
  @ForeignKey(() => User)
  @Column({ type: DataType.UUID, allowNull: false })
  declare referrerId?: string;

  // Person who is referred by someone
  @ForeignKey(() => User)
  @Column({ type: DataType.UUID, allowNull: false })
  declare referredUserId?: string;

  @Column({ type: DataType.BOOLEAN, defaultValue: false })
  declare claimed?: boolean;

  @Column({ type: DataType.INTEGER, allowNull: false })
  declare referralAmount?: number;

  // Status referralStatus enum: PENDING | CLAIMED
  @Column({ type: DataType.STRING })
  declare referralStatus?: string;

  @CreatedAt
  @Column({ type: DataType.DATE })
  declare createdAt?: Date;

  @UpdatedAt
  @Column({ type: DataType.DATE })
  declare updatedAt?: Date;

  // This creates a relation to the User model, indicating that the referrer is a User
  @BelongsTo(() => User, 'referrerId')
  declare referrer?: User;

  // This creates a relation to the User model, indicating that the referred user is also a User
  @BelongsTo(() => User, 'referredUserId')
  declare referredUser?: User;
}
