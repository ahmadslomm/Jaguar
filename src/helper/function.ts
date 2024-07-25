import User from "../schema/user.schema";
import { TTelegramUserInfo } from "../utils/Types";

// ******************* Register User ******************* //

export const registerUser = async (userInfo: TTelegramUserInfo) => {
  try {
    const { first_name, last_name, id } = userInfo;

    const user = await User.findOneAndUpdate(
      { telegramId: id },
      { telegramId: id, firstName: first_name, lastName: last_name },
      { upsert: true, new: true }
    );

    if (user) return true;

    return false;
  } catch (error) {
    return false;
  }
};
