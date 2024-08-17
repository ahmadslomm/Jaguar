import { TMultiTapLevel } from '../utils/Types';
import { Table, Column, Model, DataType, CreatedAt, UpdatedAt, PrimaryKey } from 'sequelize-typescript';

@Table({ tableName: 'multiTapLevel', timestamps: true })
export class MultiTapLevel extends Model<TMultiTapLevel> {

    @PrimaryKey
    @Column({ type: DataType.UUID, defaultValue: DataType.UUIDV4, primaryKey: true })
    declare id?: string;
    
    @Column({ type: DataType.INTEGER, allowNull: false })
    declare level?: number;

    @Column({ type: DataType.STRING, allowNull: false })
    declare levelName?: string;

    @Column({ type: DataType.INTEGER, allowNull: false })
    declare tap?: number;

    @Column({ type: DataType.INTEGER, allowNull: false })
    declare amount?: number;

    @CreatedAt
    @Column({ type: DataType.DATE })
    declare createdAt?: Date;

    @UpdatedAt
    @Column({ type: DataType.DATE })
    declare updatedAt?: Date;

    toJSON() {
        const attributes: any = Object.assign({}, this.get());
        delete attributes.createdAt;
        delete attributes.updatedAt;
        return attributes;
    }
}
