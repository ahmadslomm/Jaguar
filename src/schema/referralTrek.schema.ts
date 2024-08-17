import { Table, Column, Model, DataType, CreatedAt, UpdatedAt, PrimaryKey, ForeignKey } from 'sequelize-typescript';
import { TReferralTrek } from '../utils/Types';
import { User } from './user.schema';

@Table({ tableName: 'referralTrek', timestamps: true })
export class ReferralTrek extends Model<TReferralTrek> {
    @PrimaryKey
    @Column({
        type: DataType.UUID, 
        defaultValue : DataType.UUIDV4,
        primaryKey: true
    })
    declare id?: string;

    @ForeignKey(() => User)
    @Column({
        type: DataType.UUID
    })
    declare userId?: string;
    
    @Column({
        type: DataType.BOOLEAN,
        defaultValue: false,
    })
    readyToClaimFor1Friends!: boolean;

    @Column({
        type: DataType.BOOLEAN,
        defaultValue: false,
    })
    declare claimedFor1Friends?: boolean;

    @Column({
        type: DataType.INTEGER,
        defaultValue: 10000,
    })
    declare amountFor1Friends?: number;

    @Column({
        type: DataType.BOOLEAN,
        defaultValue: false,
    })
    declare readyToClaimFor5Friends?: boolean;

    @Column({
        type: DataType.BOOLEAN,
        defaultValue: false,
    })
    declare claimedFor5Friends?: boolean;

    @Column({
        type: DataType.INTEGER,
        defaultValue: 500000,
    })
    declare  amountFor5Friends?: number;

    @Column({
        type: DataType.BOOLEAN,
        defaultValue: false,
    })
    declare readyToClaimFor10Friends?: boolean;

    @Column({
        type: DataType.BOOLEAN,
        defaultValue: false,
    })
    declare claimedFor10Friends?: boolean;

    @Column({
        type: DataType.INTEGER,
        defaultValue: 1000000,
    })
    declare amountFor10Friends?: number;

    @Column({
        type: DataType.BOOLEAN,
        defaultValue: false,
    })
    declare readyToClaimFor20Friends?: boolean;

    @Column({
        type: DataType.BOOLEAN,
        defaultValue: false,
    })
    declare claimedFor20Friends?: boolean;

    @Column({
        type: DataType.INTEGER,
        defaultValue: 2000000,
    })
    declare amountFor20Friends?: number;

    @Column({
        type: DataType.BOOLEAN,
        defaultValue: false,
    })
    declare readyToClaimFor50Friends?: boolean;

    @Column({
        type: DataType.BOOLEAN,
        defaultValue: false,
    })
    declare claimedFor50Friends?: boolean;

    @Column({
        type: DataType.INTEGER,
        defaultValue: 5000000,
    })
    declare amountFor50Friends?: number;

    @Column({
        type: DataType.BOOLEAN,
        defaultValue: false,
    })
    declare readyToClaimFor100Friends?: boolean;

    @Column({
        type: DataType.BOOLEAN,
        defaultValue: false,
    })
    declare claimedFor100Friends?: boolean;

    @Column({
        type: DataType.INTEGER,
        defaultValue: 10000000,
    })
    declare amountFor100Friends?: number;

    @CreatedAt
    @Column({ type: DataType.DATE })
    declare createdAt?: Date;

    @UpdatedAt
    @Column({ type: DataType.DATE })
    declare updatedAt?: Date;
}

