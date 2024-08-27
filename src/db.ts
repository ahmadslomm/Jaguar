import mongoose from 'mongoose';
import { Sequelize } from 'sequelize-typescript';
import "dotenv/config";
import { User } from './schema/user.schema';
import { StatusInfo } from './schema/statusInfo.schema';
import { MultiTapLevel } from './schema/multiTapLevel.schema';
import { EnergyTankLevel } from './schema/energyTankLevel.schema';
import { EnergyChargingLevel } from './schema/energyChargingLevel.schema';
import { UserTokenInfo } from './schema/userTokenInfo.schema';
import { ReferralClaim } from './schema/referralClaim.schema';
import { SocialMediaTrek } from './schema/socialMediaTrek.schema';
import { ReferralTrek } from './schema/referralTrek.schema';
import { LeagueTrek } from './schema/leagueTrek.schema';
import { UserFlipTokenInfo } from './schema/userFlipTokenInfo.schema';


//MYSQL connection //

if (!process.env.MYSQL_USER || !process.env.MYSQL_HOST || !process.env.MYSQL_PASSWORD || !process.env.MYSQL_DATABASE) {    
    console.log("Cannot connect to database, DB credentials are missing");
    process.exit(1);
};

//********** PRODUCTION DB CONNECTION ********** //
export const sequelize = new Sequelize({
    database: 'flipcoin_backend' || process.env.VPS_MYSQL_DATABASE,
    dialect: 'mysql',
    username: 'root' || process.env.VPS_MYSQL_USER,
    password: 'Flipcoin301299' || process.env.VPS_MYSQL_PASSWORD,
    // host: '82.112.236.87',
    host: 'localhost',
    models: [User,UserFlipTokenInfo,LeagueTrek ,ReferralTrek,SocialMediaTrek, ReferralClaim, StatusInfo, MultiTapLevel, UserTokenInfo, EnergyTankLevel, EnergyChargingLevel], // Path to models
    logging: false, // Disable logging; set to console.log to see SQL queries
});

// export const sequelize = new Sequelize(process.env.VPS_MYSQL_DATABASE!, process.env.VPS_MYSQL_USER!, process.env.VPS_MYSQL_PASSWORD, {
//     host: '82.112.236.87',
//     dialect: 'mysql',
//     models: [User, StatusInfo, MultiTapLevel, EnergyTankLevel, EnergyChargingLevel, UserTokenInfo, ReferralClaim, SocialMediaTrek, ReferralTrek, LeagueTrek]
// });

//********** STAGIN DB CONNECTION ********** //
// export const sequelize = new Sequelize({
//     database: process.env.MYSQL_DATABASE,
//     dialect: 'sqlite',
//     username: process.env.MYSQL_USER,
//     password: process.env.MYSQL_PASSWORD,
//     host: 'dpg-cqt3vgij1k6c73d96nr0-a',
//     models: [User,LeagueTrek ,ReferralTrek,SocialMediaTrek, ReferralClaim, StatusInfo, MultiTapLevel, UserTokenInfo, EnergyTankLevel, EnergyChargingLevel], // Path to models
//     logging: false, // Disable logging; set to console.log to see SQL queries
// });

//********** LOCAL DB CONNECTION ********** //
// export const sequelize = new Sequelize({
//     database: process.env.LOCAL_MYSQL_DATABASE,
//     dialect: 'mysql',
//     username: process.env.LOCAL_MYSQL_USER,
//     password: process.env.LOCAL_MYSQL_PASSWORD,
//     host: process.env.LOCAL_MYSQL_HOST,
//     models: [User,UserFlipTokenInfo ,LeagueTrek ,ReferralTrek ,SocialMediaTrek,ReferralClaim, StatusInfo, MultiTapLevel, UserTokenInfo, EnergyTankLevel, EnergyChargingLevel], // Path to models
//     logging: false, // Disable logging; set to console.log to see SQL queries
// });


// MONGODB connection //

const uri = process.env.MONGODB_DATABSE_URI;
const mongooseOptions = {
    serverSelectionTimeoutMS: 50000,
};

if(!uri){    
    console.log("cannot connect to database, db credential's missing");
    process.exit(1);
    
}

export const DbInstance =  mongoose.connect(uri,mongooseOptions);