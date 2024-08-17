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
exports.UserTokenInfo = void 0;
const sequelize_typescript_1 = require("sequelize-typescript");
const user_schema_1 = require("./user.schema");
const statusInfo_schema_1 = require("./statusInfo.schema");
let UserTokenInfo = class UserTokenInfo extends sequelize_typescript_1.Model {
};
exports.UserTokenInfo = UserTokenInfo;
__decorate([
    sequelize_typescript_1.PrimaryKey,
    (0, sequelize_typescript_1.Column)({
        type: sequelize_typescript_1.DataType.UUID,
        defaultValue: sequelize_typescript_1.DataType.UUIDV4,
        primaryKey: true,
    }),
    __metadata("design:type", String)
], UserTokenInfo.prototype, "id", void 0);
__decorate([
    (0, sequelize_typescript_1.ForeignKey)(() => user_schema_1.User),
    (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.UUID, allowNull: false }),
    __metadata("design:type", String)
], UserTokenInfo.prototype, "userId", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.INTEGER, allowNull: false, defaultValue: 0 }),
    __metadata("design:type", Number)
], UserTokenInfo.prototype, "turnOverBalance", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.INTEGER, allowNull: false, defaultValue: 0 }),
    __metadata("design:type", Number)
], UserTokenInfo.prototype, "currentBalance", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.INTEGER, allowNull: false, defaultValue: 0 }),
    __metadata("design:type", Number)
], UserTokenInfo.prototype, "totalTankCapacity", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.INTEGER, allowNull: false, defaultValue: 0 }),
    __metadata("design:type", Number)
], UserTokenInfo.prototype, "currentTankBalance", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.STRING }),
    __metadata("design:type", String)
], UserTokenInfo.prototype, "multiTapLevel", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.STRING }),
    __metadata("design:type", String)
], UserTokenInfo.prototype, "energyTankLevel", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.STRING }),
    __metadata("design:type", String)
], UserTokenInfo.prototype, "energyChargingLevel", void 0);
__decorate([
    (0, sequelize_typescript_1.ForeignKey)(() => statusInfo_schema_1.StatusInfo),
    (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.UUID }),
    __metadata("design:type", String)
], UserTokenInfo.prototype, "statusId", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.DATE }),
    __metadata("design:type", Date)
], UserTokenInfo.prototype, "tankUpdateTime", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.DATE }),
    __metadata("design:type", Date)
], UserTokenInfo.prototype, "lastRewardDate", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.INTEGER }),
    __metadata("design:type", Number)
], UserTokenInfo.prototype, "lastRewardAmount", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.INTEGER, defaultValue: 7 }),
    __metadata("design:type", Number)
], UserTokenInfo.prototype, "dailyChargingBooster", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.INTEGER, defaultValue: 7 }),
    __metadata("design:type", Number)
], UserTokenInfo.prototype, "dailyTappingBoosters", void 0);
__decorate([
    (0, sequelize_typescript_1.BelongsTo)(() => statusInfo_schema_1.StatusInfo, "statusId"),
    __metadata("design:type", statusInfo_schema_1.StatusInfo)
], UserTokenInfo.prototype, "statusInfo", void 0);
__decorate([
    (0, sequelize_typescript_1.BelongsTo)(() => user_schema_1.User, "userId"),
    __metadata("design:type", user_schema_1.User)
], UserTokenInfo.prototype, "userInfo", void 0);
exports.UserTokenInfo = UserTokenInfo = __decorate([
    (0, sequelize_typescript_1.Table)({ tableName: "userTokenInfo", timestamps: false })
], UserTokenInfo);
// import { Schema, Model, model }  from 'mongoose';
// const userTokenInfoSchema = new Schema<TUserTokenInfoModel>(
//     {
//         userId : {
//             type : Schema.Types.ObjectId,
//             required : true
//         },
//         turnOverBalance : {
//             type : Number,
//             required : true,
//             default : 0
//         },
//         currentBalance : {
//             type : Number,
//             required : true,
//             default : 0
//         },
//         totalTankCapacity : {
//             type : Number,
//             required : true,
//             default : 0
//         },
//         currentTankBalance : {
//             type : Number,
//             required : true,
//             default : 0
//         },
//         levelId : {
//             type : Schema.Types.ObjectId,
//             ref : 'levelInfo'
//         },
//         multiTapLevel : {
//             type : String,
//             ref : 'multiTapLevel'
//         },
//         energyTankLevel : {
//             type : String,
//             ref : 'energyTankLevel'
//         },
//         energyChargingLevel : {
//             type : String,
//             ref : 'energyChargingLevel'
//         },
//         statusId : {
//             type : Schema.Types.ObjectId,
//             ref : 'statusInfo'
//         },
//         tankUpdateTime : {
//             type : Date,
//         },
//         lastRewardDate : {
//             type : Date,
//         },
//         lastRewardAmount : {
//             type : Number,
//         },
//         dailyChargingBooster : {
//             type : Number,
//             default : 7
//         },
//         dailyTappingBoosters : {
//             type : Number,
//             default : 7
//         }
//     }
// );
// const collectionName = 'userTokenInfo';
// const UserTokenInfo = model<TUserTokenInfoModel>(collectionName, userTokenInfoSchema);
// export default UserTokenInfo;
