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
    id!: string;

    @ForeignKey(() => User)
    @Column({
        type: DataType.UUID,
        allowNull: false,
    })
    userId!: string;

    // Beginner level fields
    @Column({
        type: DataType.BOOLEAN,
        defaultValue: false,
    })
    readyToClaimForBeginner!: boolean;

    @Column({
        type: DataType.BOOLEAN,
        defaultValue: false,
    })
    claimedForBeginner!: boolean;

    @Column({
        type: DataType.INTEGER,
        defaultValue: 2000,
    })
    amountForBeginner!: number;

    // Player level fields
    @Column({
        type: DataType.BOOLEAN,
        defaultValue: false,
    })
    readyToClaimForPlayer!: boolean;

    @Column({
        type: DataType.BOOLEAN,
        defaultValue: false,
    })
    claimedForPlayer!: boolean;

    @Column({
        type: DataType.INTEGER,
        defaultValue: 5000,
    })
    amountForPlayer!: number;

    // Fan level fields
    @Column({
        type: DataType.BOOLEAN,
        defaultValue: false,
    })
    readyToClaimForFan!: boolean;

    @Column({
        type: DataType.BOOLEAN,
        defaultValue: false,
    })
    claimedForFan!: boolean;

    @Column({
        type: DataType.INTEGER,
        defaultValue: 10000,
    })
    amountForFan!: number;

    // Gamer level fields
    @Column({
        type: DataType.BOOLEAN,
        defaultValue: false,
    })
    readyToClaimForGamer!: boolean;

    @Column({
        type: DataType.BOOLEAN,
        defaultValue: false,
    })
    claimedForGamer!: boolean;

    @Column({
        type: DataType.INTEGER,
        defaultValue: 50000,
    })
    amountForGamer!: number;

    // Expert level fields
    @Column({
        type: DataType.BOOLEAN,
        defaultValue: false,
    })
    readyToClaimForExpert!: boolean;

    @Column({
        type: DataType.BOOLEAN,
        defaultValue: false,
    })
    claimedForExpert!: boolean;

    @Column({
        type: DataType.INTEGER,
        defaultValue: 100000,
    })
    amountForExpert!: number;

    @CreatedAt
    @Column({ type: DataType.DATE })
    createdAt?: Date;

    @UpdatedAt
    @Column({ type: DataType.DATE })
    updatedAt?: Date;
}
