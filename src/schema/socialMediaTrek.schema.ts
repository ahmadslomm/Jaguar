import { Table, Column, Model, DataType, CreatedAt, UpdatedAt, PrimaryKey, ForeignKey } from 'sequelize-typescript';
import { User } from './user.schema';
import { TSocialMediaTrek } from '../utils/Types';

@Table({
    tableName: 'socialMediaTrek',
    timestamps: true,
})
export class SocialMediaTrek extends Model<TSocialMediaTrek> {
    @PrimaryKey
    @Column({
        type: DataType.INTEGER,
        allowNull: false,
        autoIncrement: true,
    })
    declare id?: number;

    @ForeignKey(() => User)
    @Column({
        type: DataType.STRING,
        allowNull: false,
    })
    userId!: string;

    @Column({
        type: DataType.BOOLEAN,
        defaultValue: false,
    })
    followTwitter!: boolean;

    @Column({
        type: DataType.BOOLEAN,
        defaultValue: false,
    })
    followTwitterClaimed!: boolean;

    @Column({
        type: DataType.BOOLEAN,
        defaultValue: false,
    })
    joinTwitter!: boolean;

    @Column({
        type: DataType.BOOLEAN,
        defaultValue: false,
    })
    joinTwitterClaimed!: boolean;

    @Column({
        type: DataType.BOOLEAN,
        defaultValue: false,
    })
    followYouTube!: boolean;

    @Column({
        type: DataType.BOOLEAN,
        defaultValue: false,
    })
    followYouTubeClaimed!: boolean;

    @Column({
        type: DataType.BOOLEAN,
        defaultValue: false,
    })
    joinYouTube!: boolean;

    @Column({
        type: DataType.BOOLEAN,
        defaultValue: false,
    })
    joinYouTubeClaimed!: boolean;

    @Column({
        type: DataType.BOOLEAN,
        defaultValue: false,
    })
    followInstagram!: boolean;

    @Column({
        type: DataType.BOOLEAN,
        defaultValue: false,
    })
    followInstagramClaimed!: boolean;

    @Column({
        type: DataType.BOOLEAN,
        defaultValue: false,
    })
    joinInstagram!: boolean;

    @Column({
        type: DataType.BOOLEAN,
        defaultValue: false,
    })
    joinInstagramClaimed!: boolean;

    @Column({
        type: DataType.BOOLEAN,
        defaultValue: false,
    })
    followTelegram!: boolean;

    @Column({
        type: DataType.BOOLEAN,
        defaultValue: false,
    })
    followTelegramClaimed!: boolean;

    @Column({
        type: DataType.BOOLEAN,
        defaultValue: false,
    })
    joinTelegram!: boolean;

    @Column({
        type: DataType.BOOLEAN,
        defaultValue: false,
    })
    joinTelegramClaimed!: boolean;

    @Column({
        type : DataType.INTEGER,
        defaultValue: 100000
    })
    amount!: number;

    @CreatedAt
    @Column({
        type: DataType.DATE,
        allowNull: false,
    })
    declare createdAt?: Date;

    @UpdatedAt
    @Column({
        type: DataType.DATE,
        allowNull: false,
    })
   declare updatedAt?: Date;
}
