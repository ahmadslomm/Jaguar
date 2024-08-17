"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
require("dotenv/config");
const cors_1 = __importDefault(require("cors"));
const route_1 = __importDefault(require("./route"));
const db_1 = require("./db");
// import { registerUser } from './helper/function';
const port = process.env.PORT;
const app = (0, express_1.default)();
const token = process.env.TELEGRAM_BOT_TOKEN;
// if(token) {
//     const URL = process.env.APP_URL
//     const bot = new Telegraf(token);
//     bot.start(async(ctx:any) => {
//         // ctx.reply('Welcome to the Telegram Bot!');
//         const checkuserRegistrationStatus: boolean = await registerUser(ctx.update.message.from);
//         checkuserRegistrationStatus && (ctx.replyWithMarkdownV2(`*Hey ${ctx.update.message.from.first_name} ${ctx.update.message.from.last_name} Welcome to the telegram bot*`,{
//             reply_markup: {
//                 inline_keyboard: [
//                     [{text: 'Click me', web_app: { url : URL}}]
//                 ]
//             }
//         }))
//     });
//     bot.launch();
// }
app.use((0, cors_1.default)());
app.use(express_1.default.json());
app.use('/api/v1', route_1.default);
// Optionally, you can handle errors and database connection
db_1.sequelize.authenticate().then(() => __awaiter(void 0, void 0, void 0, function* () {
    yield db_1.sequelize.sync();
    console.log("Database connected successfully");
    app.listen(port, () => {
        try {
            console.log(`Server is running at ${port}`);
        }
        catch (error) {
            console.log(`Getting error for running at ${port}`, error);
        }
    });
})).catch((error) => {
    console.log("Getting error for database connection", error);
});
// Getting the user data ..... {
//     id: 716024028,
//     is_bot: false,
//     first_name: 'Red',
//     last_name: 'wine🍷',
//     language_code: 'en'
//   }
