import express from 'express';
import 'dotenv/config';
import cors from 'cors';
import Route from './route';
import { Telegraf } from 'telegraf';
import { DbInstance,sequelize } from './db';
import { User } from './schema/user.schema';
import { createUser } from './helper/function';
// import { registerUser } from './helper/function';


const port = process.env.PORT;

const app = express();
const token:string | undefined= process.env.TELEGRAM_BOT_TOKEN;

// if(token) {
//     const URL = process.env.APP_URL
//     const bot = new Telegraf(token);
    
//     bot.start(async(ctx:any) => {
//         // ctx.reply('Welcome to the Telegram Bot!');
//        const payload = ctx.update.message.from
//         const userInfo :any = {
//             firstName : payload.first_name,
//             lastName : payload.last_name,
//             telegramId : payload.id,
//         }

//         console.log("Getting the telegram data...", ctx.update);
        
//         let checkuserRegistrationStatus:any = await User.findOne({ where: { telegramId: payload?.id } });
        
//         console.log("first registration", checkuserRegistrationStatus)
//         if(!checkuserRegistrationStatus) {
//             // const checkuserRegistrationStatus: boolean = true;
//             checkuserRegistrationStatus = await createUser(userInfo);
//         }
     
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

app.use(cors());
app.use(express.json());
app.use('/api/v1',Route);
app.use('/api/v1/health', (req, res) => {
    res.status(200).json({ message : 'Hello, world! We are live' });
})

// Optionally, you can handle errors and database connection
sequelize.authenticate().then(async() => {
    await sequelize.sync();
    console.log("Database connected successfully");
    app.listen(port, () => {
        try {
            console.log(`Server is running at ${port}`);
        } catch (error) {
            console.log(`Getting error for running at ${port}`, error);
        }
    })
}).catch( (error) => {
    console.log("Getting error for database connection", error);
});

// Getting the user data ..... {
//     id: 716024028,
//     is_bot: false,
//     first_name: 'Red',
//     last_name: 'wine🍷',
//     language_code: 'en'
//   }