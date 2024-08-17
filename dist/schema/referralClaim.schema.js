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
exports.ReferralClaim = void 0;
const sequelize_typescript_1 = require("sequelize-typescript");
const user_schema_1 = require("./user.schema");
let ReferralClaim = class ReferralClaim extends sequelize_typescript_1.Model {
};
exports.ReferralClaim = ReferralClaim;
__decorate([
    sequelize_typescript_1.PrimaryKey,
    (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.UUID, defaultValue: sequelize_typescript_1.DataType.UUIDV4 }),
    __metadata("design:type", String)
], ReferralClaim.prototype, "id", void 0);
__decorate([
    (0, sequelize_typescript_1.ForeignKey)(() => user_schema_1.User),
    (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.UUID, allowNull: false }),
    __metadata("design:type", String)
], ReferralClaim.prototype, "referrerId", void 0);
__decorate([
    (0, sequelize_typescript_1.ForeignKey)(() => user_schema_1.User),
    (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.UUID, allowNull: false }),
    __metadata("design:type", String)
], ReferralClaim.prototype, "referredUserId", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.BOOLEAN, defaultValue: false }),
    __metadata("design:type", Boolean)
], ReferralClaim.prototype, "claimed", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.INTEGER, allowNull: false }),
    __metadata("design:type", Number)
], ReferralClaim.prototype, "referralAmount", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.STRING, }),
    __metadata("design:type", Number)
], ReferralClaim.prototype, "referralStatus", void 0);
__decorate([
    sequelize_typescript_1.CreatedAt,
    (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.DATE }),
    __metadata("design:type", Date)
], ReferralClaim.prototype, "createdAt", void 0);
__decorate([
    sequelize_typescript_1.UpdatedAt,
    (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.DATE }),
    __metadata("design:type", Date)
], ReferralClaim.prototype, "updatedAt", void 0);
__decorate([
    (0, sequelize_typescript_1.BelongsTo)(() => user_schema_1.User, 'referrerId'),
    __metadata("design:type", user_schema_1.User)
], ReferralClaim.prototype, "referrer", void 0);
__decorate([
    (0, sequelize_typescript_1.BelongsTo)(() => user_schema_1.User, 'referredUserId'),
    __metadata("design:type", user_schema_1.User)
], ReferralClaim.prototype, "referredUser", void 0);
exports.ReferralClaim = ReferralClaim = __decorate([
    (0, sequelize_typescript_1.Table)({ tableName: 'referralClaims', timestamps: true })
], ReferralClaim);
;
