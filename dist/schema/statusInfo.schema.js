"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.StatusInfo = void 0;
const sequelize_typescript_1 = require("sequelize-typescript");
let StatusInfo = class StatusInfo extends sequelize_typescript_1.Model {
};
exports.StatusInfo = StatusInfo;
__decorate([
    sequelize_typescript_1.PrimaryKey,
    (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.UUID, defaultValue: sequelize_typescript_1.DataType.UUIDV4, primaryKey: true }),
    __metadata("design:type", String)
], StatusInfo.prototype, "id", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.STRING, allowNull: false }),
    __metadata("design:type", String)
], StatusInfo.prototype, "status", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.INTEGER, allowNull: false }),
    __metadata("design:type", Number)
], StatusInfo.prototype, "minRequired", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.INTEGER, allowNull: false }),
    __metadata("design:type", Number)
], StatusInfo.prototype, "maxRequired", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.INTEGER, allowNull: true }),
    __metadata("design:type", Number)
], StatusInfo.prototype, "reward", void 0);
__decorate([
    sequelize_typescript_1.CreatedAt,
    (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.DATE }),
    __metadata("design:type", Date)
], StatusInfo.prototype, "createdAt", void 0);
__decorate([
    sequelize_typescript_1.UpdatedAt,
    (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.DATE }),
    __metadata("design:type", Date)
], StatusInfo.prototype, "updatedAt", void 0);
exports.StatusInfo = StatusInfo = __decorate([
    (0, sequelize_typescript_1.Table)({ tableName: 'statusInfo', timestamps: true })
], StatusInfo);
// import { Schema, Model, model } from 'mongoose';
// const statusInfoSchema = new Schema<TStatusInfoModel>(
//     {
//         status : {
//             type : String,
//             required : true
//         },
//         minRequired : {
//             type : Number,
//             required : true
//         },
//         maxRequired : {
//             type : Number,
//             required : true
//         },
//         reward : {
//             type : Number
//         }
//     },
//     {
//         timestamps : true
//     }
// );
// const collectionName = 'statusInfo';
// const statusInfoModel = model<TStatusInfoModel>(collectionName, statusInfoSchema);
// export default statusInfoModel;
