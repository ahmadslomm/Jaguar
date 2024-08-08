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
    id!: string;

    @ForeignKey(() => User)
    @Column({
        type: DataType.UUID
    })
    userId!: string;
    
    @Column({
        type: DataType.BOOLEAN,
        defaultValue: false,
    })
    readyToClaimFor1Friends!: boolean;

    @Column({
        type: DataType.BOOLEAN,
        defaultValue: false,
    })
    claimedFor1Friends!: boolean;

    @Column({
        type: DataType.INTEGER,
        defaultValue: 10000,
    })
    amountFor1Friends!: number;

    @Column({
        type: DataType.BOOLEAN,
        defaultValue: false,
    })
    readyToClaimFor5Friends!: boolean;

    @Column({
        type: DataType.BOOLEAN,
        defaultValue: false,
    })
    claimedFor5Friends!: boolean;

    @Column({
        type: DataType.INTEGER,
        defaultValue: 500000,
    })
    amountFor5Friends!: number;

    @Column({
        type: DataType.BOOLEAN,
        defaultValue: false,
    })
    readyToClaimFor10Friends!: boolean;

    @Column({
        type: DataType.BOOLEAN,
        defaultValue: false,
    })
    claimedFor10Friends!: boolean;

    @Column({
        type: DataType.INTEGER,
        defaultValue: 1000000,
    })
    amountFor10Friends!: number;

    @Column({
        type: DataType.BOOLEAN,
        defaultValue: false,
    })
    readyToClaimFor20Friends!: boolean;

    @Column({
        type: DataType.BOOLEAN,
        defaultValue: false,
    })
    claimedFor20Friends!: boolean;

    @Column({
        type: DataType.INTEGER,
        defaultValue: 2000000,
    })
    amountFor20Friends!: number;

    @Column({
        type: DataType.BOOLEAN,
        defaultValue: false,
    })
    readyToClaimFor50Friends!: boolean;

    @Column({
        type: DataType.BOOLEAN,
        defaultValue: false,
    })
    claimedFor50Friends!: boolean;

    @Column({
        type: DataType.INTEGER,
        defaultValue: 5000000,
    })
    amountFor50Friends!: number;

    @Column({
        type: DataType.BOOLEAN,
        defaultValue: false,
    })
    readyToClaimFor100Friends!: boolean;

    @Column({
        type: DataType.BOOLEAN,
        defaultValue: false,
    })
    claimedFor100Friends!: boolean;

    @Column({
        type: DataType.INTEGER,
        defaultValue: 10000000,
    })
    amountFor100Friends!: number;

    @CreatedAt
    @Column({ type: DataType.DATE })
    createdAt?: Date;

    @UpdatedAt
    @Column({ type: DataType.DATE })
    updatedAt?: Date;
}

