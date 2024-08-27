import { TUserFlipTokenInfp } from "../utils/Types";
import {
    Table,
    Column,
    Model,
    DataType,
    ForeignKey,
    PrimaryKey,
    BelongsTo
} from "sequelize-typescript";
import { User } from "./user.schema";

@Table({
    tableName : "userFlipTokenInfo",
    timestamps: true,
})
export class UserFlipTokenInfo extends Model<TUserFlipTokenInfp> {
    @PrimaryKey
    @Column({
      type: DataType.UUID,
      defaultValue: DataType.UUIDV4,
      primaryKey: true,
    })
    declare id?: string;

    @ForeignKey(() => User)
    @Column({ type: DataType.UUID, allowNull: false })
    declare userId: string;

    @Column({
        type: DataType.INTEGER,
        defaultValue: 0
    })
    declare currentFlipTokens: number;

    @BelongsTo(( () => User), "userId")
    userInfo!: User
}