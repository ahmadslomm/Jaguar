import { Request, Response } from "express";
import User from "../../schema/user.schema";
import { GenResObj } from "../../utils/ResponseFormat";
import { HttpStatusCodes as Code } from "../../utils/Enum";
import LevelInfo from "../../schema/levelInfo.schema";
import { createUser } from "../../helper/function";

export const register = async (req: Request) => {
  try {
    const payload = req.body;

    let checkAvlUser = await User.findOne({ telegramId: payload?.telegramId });

    if (!checkAvlUser) {
        await createUser(payload)
    }

    return GenResObj(Code.CREATED, true, "User registration checked successfully", null);
  } catch (error) {
    console.log("Getting error for  checking the user's registration :", error);
    return GenResObj(
      Code.INTERNAL_SERVER,
      false,
      "Internal server error",
      null
    );
  }
};

export const getUserRegistration = async (req: Request) => {
  try {
    const userData = await User.find({});

    return GenResObj(
      Code.CREATED,
      true,
      "User details fetched successfully",
      userData
    );
  } catch (error) {
    console.log("Getting error for getting user registration :", error);
    return GenResObj(
      Code.INTERNAL_SERVER,
      false,
      "Internal server error",
      null
    );
  }
};
