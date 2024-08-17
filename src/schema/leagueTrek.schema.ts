import { Table, Column, Model, DataType, CreatedAt, UpdatedAt, PrimaryKey, ForeignKey } from 'sequelize-typescript';
import { User } from './user.schema';
import { TLeagueTrek } from '../utils/Types';

@Table({ tableName: 'leagueTrek', timestamps: true })
export class LeagueTrek extends Model<TLeagueTrek> {
    @PrimaryKey
    @Column({
        type: DataType.UUID, 
        defaultValue: DataType.UUIDV4,
    })
    declare id?: string;

    @ForeignKey(() => User)
    @Column({
        type: DataType.UUID,
        allowNull: false,
    })
    declare userId?: string;

    // Beginner level fields
    @Column({
        type: DataType.BOOLEAN,
        defaultValue: false,
    })
    declare readyToClaimForBeginner?: boolean;

    @Column({
        type: DataType.BOOLEAN,
        defaultValue: false,
    })
    declare claimedForBeginner?: boolean;

    @Column({
        type: DataType.INTEGER,
        defaultValue: 2000,
    })
    declare amountForBeginner?: number;

    // Player level fields
    @Column({
        type: DataType.BOOLEAN,
        defaultValue: false,
    })
    declare readyToClaimForPlayer?: boolean;

    @Column({
        type: DataType.BOOLEAN,
        defaultValue: false,
    })
    declare claimedForPlayer?: boolean;

    @Column({
        type: DataType.INTEGER,
        defaultValue: 5000,
    })
    declare amountForPlayer?: number;

    // Fan level fields
    @Column({
        type: DataType.BOOLEAN,
        defaultValue: false,
    })
    declare readyToClaimForFan?: boolean;

    @Column({
        type: DataType.BOOLEAN,
        defaultValue: false,
    })
    declare claimedForFan?: boolean;

    @Column({
        type: DataType.INTEGER,
        defaultValue: 10000,
    })
    declare amountForFan?: number;

    // Gamer level fields
    @Column({
        type: DataType.BOOLEAN,
        defaultValue: false,
    })
    declare readyToClaimForGamer?: boolean;

    @Column({
        type: DataType.BOOLEAN,
        defaultValue: false,
    })
    declare claimedForGamer?: boolean;

    @Column({
        type: DataType.INTEGER,
        defaultValue: 50000,
    })
    declare amountForGamer?: number;

    // Expert level fields
    @Column({
        type: DataType.BOOLEAN,
        defaultValue: false,
    })
    declare readyToClaimForExpert?: boolean;

    @Column({
        type: DataType.BOOLEAN,
        defaultValue: false,
    })
    declare claimedForExpert?: boolean;

    @Column({
        type: DataType.INTEGER,
        defaultValue: 100000,
    })
    declare amountForExpert?: number;

    @CreatedAt
    @Column({ type: DataType.DATE })
    declare createdAt?: Date;

    @UpdatedAt
    @Column({ type: DataType.DATE })
    declare updatedAt?: Date;
}
