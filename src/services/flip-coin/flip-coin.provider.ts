import { Request, Response } from "express";
import { AuthRequest } from "../../middleware/authentication/jsonToken";
import { User } from "../../schema/user.schema";
import { UserTokenInfo } from "../../schema/userTokenInfo.schema";
import { UserFlipTokenInfo } from "../../schema/userFlipTokenInfo.schema";
import { HttpStatusCodes as Code } from "../../utils/Enum";
import { GenResObj } from "../../utils/ResponseFormat";

import { StatusInfo } from "../../schema/statusInfo.schema";
import { col } from "sequelize";

export const getUserFlipTokenInfo = async (req: AuthRequest) => {
  try {
    const { telegramId } = req;
    const checkAvlUser = await User.findOne({
      where: { telegramId },
      raw: true,
    });

    const checkAvlUserTokenInfo: any = await UserTokenInfo.findOne({
      where: { userId: checkAvlUser?.id },
      raw: true,
      include: [
        {
          model: StatusInfo,
          attributes: [],
        },
      ],
      attributes: [[col("statusInfo.status"), "status"], "currentBalance"],
    });

    const checkAvlUserFlipTokenInfo: any = await UserFlipTokenInfo.findOne({
      where: {
        userId: checkAvlUser?.id,
      },
      raw: true,
      attributes: ["currentFlipTokens"],
    });

    const resObj = {
      currentLevel: checkAvlUserTokenInfo?.status,
      currentBalance: checkAvlUserTokenInfo?.currentBalance,
      currentFlipToeks: checkAvlUserFlipTokenInfo?.currentFlipTokens,
      oneFlipTokenPerCoin: process.env.ONEFLIPTOKENPERCOIN,
    };

    return GenResObj(
      Code.CREATED,
      true,
      "Flip token info fetched successfully",
      resObj
    );
  } catch (error) {
    console.log("Getting error for getting user token info :", error);
    return GenResObj(
      Code.INTERNAL_SERVER,
      false,
      "Internal server error",
      null
    );
  }
};

export const addUserFlipToken = async (req: AuthRequest) => {
  try {
    const { telegramId } = req;

    const { token }  = req.body;

    const checkAvlUser = await User.findOne({
      where: { telegramId },
      raw: true,
    });

    const checkAvlUserTokenInfo: any = await UserTokenInfo.findOne({
      where: { userId: checkAvlUser?.id },
      raw: true,
      include: [
        {
          model: StatusInfo,
          attributes: [],
        },
      ],
      attributes: [[col("statusInfo.status"), "status"], "currentBalance"],
    });

    const oneFlipTokenPerCoin: any = process.env.ONEFLIPTOKENPERCOIN;

    if (checkAvlUserTokenInfo?.currentBalance < oneFlipTokenPerCoin) {
      return GenResObj(
        Code.BAD_REQUEST,
        false,
        "Current balance is not enough to swap the coin with FLIP TOKEN"
      );
    };
    if (token < oneFlipTokenPerCoin) {
      return GenResObj(
        Code.BAD_REQUEST,
        false,
        `Required minimum ${oneFlipTokenPerCoin} coins to swap with FLIP TOKEN`
      );
    };



    const flipTokenToAdd = +token / oneFlipTokenPerCoin

    const remainingToken = checkAvlUserTokenInfo?.currentBalance - (+token);

    const updateUserTokenInfo = await UserTokenInfo.update({ currentBalance : remainingToken}, { where : { userId : checkAvlUser?.id}});

    console.log("Getting the updated UserTokenInfo", updateUserTokenInfo)
    
    const updateUserFlipTokenInfo = await UserFlipTokenInfo.update({ currentFlipTokens : flipTokenToAdd }, { where : { userId : checkAvlUser?.id }});
    console.log("Getting the updated updateUserFlipTokenInfo", updateUserFlipTokenInfo)

    return GenResObj(Code.CREATED, true, 'Flip-token swapped successfully');
    
  } catch (error) {
    console.log("Getting error for adding user flip token :", error);
    return GenResObj(
      Code.INTERNAL_SERVER,
      false,
      "Internal server error",
      null
    );
  }
};
