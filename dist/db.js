"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.DbInstance = exports.sequelize = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const sequelize_typescript_1 = require("sequelize-typescript");
require("dotenv/config");
const user_schema_1 = require("./schema/user.schema");
const statusInfo_schema_1 = require("./schema/statusInfo.schema");
const multiTapLevel_schema_1 = require("./schema/multiTapLevel.schema");
const energyTankLevel_schema_1 = require("./schema/energyTankLevel.schema");
const energyChargingLevel_schema_1 = require("./schema/energyChargingLevel.schema");
const userTokenInfo_schema_1 = require("./schema/userTokenInfo.schema");
const referralClaim_schema_1 = require("./schema/referralClaim.schema");
const socialMediaTrek_schema_1 = require("./schema/socialMediaTrek.schema");
const referralTrek_schema_1 = require("./schema/referralTrek.schema");
const leagueTrek_schema_1 = require("./schema/leagueTrek.schema");
//MYSQL connection //
if (!process.env.MYSQL_USER || !process.env.MYSQL_HOST || !process.env.MYSQL_PASSWORD || !process.env.MYSQL_DATABASE) {
    console.log("Cannot connect to database, DB credentials are missing");
    process.exit(1);
}
;
//********** PRODUCTION DB CONNECTION ********** //
exports.sequelize = new sequelize_typescript_1.Sequelize({
    database: process.env.MYSQL_DATABASE,
    dialect: 'sqlite',
    username: process.env.MYSQL_USER,
    password: process.env.MYSQL_PASSWORD,
    host: 'dpg-cqt3vgij1k6c73d96nr0-a',
    models: [user_schema_1.User, leagueTrek_schema_1.LeagueTrek, referralTrek_schema_1.ReferralTrek, socialMediaTrek_schema_1.SocialMediaTrek, referralClaim_schema_1.ReferralClaim, statusInfo_schema_1.StatusInfo, multiTapLevel_schema_1.MultiTapLevel, userTokenInfo_schema_1.UserTokenInfo, energyTankLevel_schema_1.EnergyTankLevel, energyChargingLevel_schema_1.EnergyChargingLevel], // Path to models
    logging: false, // Disable logging; set to console.log to see SQL queries
});
//********** LOCAL DB CONNECTION ********** //
// export const sequelize = new Sequelize({
//     database: process.env.LOCAL_MYSQL_DATABASE,
//     dialect: 'mysql',
//     username: process.env.LOCAL_MYSQL_USER,
//     password: process.env.LOCAL_MYSQL_PASSWORD,
//     host: process.env.LOCAL_MYSQL_HOST,
//     models: [User,LeagueTrek ,ReferralTrek ,SocialMediaTrek,ReferralClaim, StatusInfo, MultiTapLevel, UserTokenInfo, EnergyTankLevel, EnergyChargingLevel], // Path to models
//     logging: false, // Disable logging; set to console.log to see SQL queries
// });
// MONGODB connection //
const uri = process.env.MONGODB_DATABSE_URI;
const mongooseOptions = {
    serverSelectionTimeoutMS: 50000,
};
if (!uri) {
    console.log("cannot connect to database, db credential's missing");
    process.exit(1);
}
exports.DbInstance = mongoose_1.default.connect(uri, mongooseOptions);
