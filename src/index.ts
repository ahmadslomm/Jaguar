import express from "express";
import "dotenv/config";
import cors from "cors";
import Route from "./route";
import { Telegraf, Markup } from "telegraf";
import { DbInstance, sequelize } from "./db";
import { User } from "./schema/user.schema";
import { createUser } from "./helper/function";
// import { registerUser } from './helper/function';

const port = process.env.PORT;

const app = express();
const token: string | undefined = process.env.TELEGRAM_BOT_TOKEN;

function escapeMarkdownV2(text:any) {
    return text
        .replace(/([_*\[\]()~`>#+\-=|{}.!])/g, '\\$1')  // Escapes all MarkdownV2 special characters
        .replace(/\\\./g, '\\.');  // Specific fix for escaped dots
}

if (token) {
  const URL = process.env.APP_URL;
  const bot = new Telegraf(token);

  bot.start(async (ctx: any) => {
    console.log(
      "Geting the CTX response********************************",
      ctx.update.message.text
    );
    
    const message = ctx.update.message.text;
    let checkAvlReferredId: Boolean = false;
    let referralCode: string = "";
    if (message.startsWith("/start")) {
      const [start, referralCodeOfReferredUser] = message.split(" ");
      referralCode = referralCodeOfReferredUser;
      checkAvlReferredId = true;
    }

    const payload = ctx.update.message.from;
    const userInfo: any = {
      firstName: payload.first_name,
      lastName: payload.last_name,
      telegramId: payload.id,
      ...(checkAvlReferredId && { referralCode: referralCode }),
    };

    console.log("Getting the telegram data...", ctx.update.message.from);

    let checkuserRegistrationStatus: any = await User.findOne({
      where: { telegramId: payload?.id },
      raw: true,
    });

    console.log("Avaialble data from DB ::::", checkuserRegistrationStatus);
    if (!checkuserRegistrationStatus) {
      // const checkuserRegistrationStatus: boolean = true;
      checkuserRegistrationStatus = await createUser(userInfo);
    }

    const redirectURL = `${URL}?telegramId=${payload?.id}`;

    console.log("Getting the redirect URL......", redirectURL);

    const welcomeMessage = `
    Hey there 😊! Your Flipcoin bot is packed with coins 🪙. Claim them now and start flipping your way to becoming a true degen\! ✌🏼
    
    Don’t forget to invite your friends—flip together and multiply your rewards\! 🎉
            `;

    // Define the inline keyboard with three buttons
    const keyboard = Markup.inlineKeyboard([
      [Markup.button.webApp("Start Flipping 🚀", redirectURL)],
      [Markup.button.url('Join Community 🌐', 'https://t.me/FlipCoin_Community')],
      [Markup.button.callback("Help ❓", "help")],
    ]);

    // Send the welcome message with the keyboard
    // checkuserRegistrationStatus && ctx.reply(welcomeMessage, keyboard);
    ctx.reply(welcomeMessage, keyboard);

  });

  bot.action('join_community', (ctx:any) => {
    console.log(
        "Geting the CTX response******************************** from join_community",
        ctx
      );
    // Redirects to the Telegram community
    // ctx.replyWithMarkdownV2(`[Join our Community 🌐](https://t.me/FlipCoin_Community)`);
    ctx.replyWithMarkdownV2(`[Join our Community 🌐](https://frontend.flipcoingame.xyz/dummy)`);
});

  bot.action("help", (ctx:any) => {
    console.log(
        "Geting the CTX response******************************** from help options", ctx.update.callback_query);
        // console.dir(ctx, { depth : null})
    // Define the help message
    const helpMessage = `
How to Play Flipcoin ✨️

💰 Tap to Earn 
Simply tap the screen of the coin and watch your coins increase with each tap\.

🎮 Play Game
Feeling lucky\? You can gamble up to 50% of your total coins to either double your earnings or lose it all\. Choose your side wisely and see if fortune favors you\!

🔄 Swap Token 
Once you reach a certain level\, you'll unlock the token swap feature\, allowing you to exchange your coins\. This unique feature will be available earlier than in most other projects\, giving you a head start\.

📈 Level  
As you accumulate more coins\, your level will increase\, unlocking faster earning opportunities and exclusive features\.

👥 Invite  
Bring your friends into the game and earn bonuses\! When they progress\, you'll gain even more rewards\, making it a win\-win for everyone\.

📢 Stay Tuned  
More information will be updated as we launch and continue to enhance our app\.
        `;
    const escapedMessage = escapeMarkdownV2(helpMessage);
    const telegramId = ctx.update.callback_query.from.id;
    const redirectURL = `${URL}?telegramId=${telegramId}`;
    console.log("getting the redirectURL from the help option", redirectURL)
    // Send the help message with additional buttons
    ctx.replyWithMarkdownV2(
        escapedMessage,
      Markup.inlineKeyboard([
        [Markup.button.webApp('Start Flipping 🚀', redirectURL)],
        [Markup.button.url('Join Community 🌐', 'https://t.me/FlipCoin_Community')],
      ])
    );
  });

  bot.launch();
}

app.use(cors());
app.use(express.json());
app.use("/api/v1", Route);
app.use("/api/v1/health", (req, res) => {
  res.status(200).json({ message: "Hello, world! We are live" });
});

// Optionally, you can handle errors and database connection
sequelize
  .authenticate()
  .then(async () => {
    await sequelize.sync();
    console.log("Database connected successfully");
    app.listen(port, () => {
      try {
        console.log(`Server is running at ${port}`);
      } catch (error) {
        console.log(`Getting error for running at ${port}`, error);
      }
    });
  })
  .catch((error) => {
    console.log("Getting error for database connection", error);
  });

// Getting the user data ..... {
//     id: 716024028,
//     is_bot: false,
//     first_name: 'Red',
//     last_name: 'wine🍷',
//     language_code: 'en'
//   }
