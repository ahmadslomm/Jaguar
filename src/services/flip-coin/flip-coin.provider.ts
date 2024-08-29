import { Request, Response } from "express";
import { AuthRequest } from "../../middleware/authentication/jsonToken";
import { User } from "../../schema/user.schema";
import { UserTokenInfo } from "../../schema/userTokenInfo.schema";
import { UserFlipTokenInfo } from "../../schema/userFlipTokenInfo.schema";
import { HttpStatusCodes as Code } from "../../utils/Enum";
import { GenResObj } from "../../utils/ResponseFormat";

import { StatusInfo } from "../../schema/statusInfo.schema";
import { col } from "sequelize";
import { Auth } from "mongodb";

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

    console.log("getting the checkAvlUserFlipTokenInfo", checkAvlUserFlipTokenInfo)

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

export const getUserTokenInfoForGame = async(req: AuthRequest) => {
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
      attributes: [[col("statusInfo.status"), "status"], "currentBalance","dailyGammingLimit"],
    });

    const availableBalanceForGame = +checkAvlUserTokenInfo?.currentBalance % 2 != 0 ? (+checkAvlUserTokenInfo?.currentBalance / 2) + 1 : +checkAvlUserTokenInfo?.currentBalance / 2;
    const resObj = {
      currentBalance : checkAvlUserTokenInfo?.currentBalance,
      availableBalanceForGame,
      availableBetsForGame : checkAvlUserTokenInfo?.dailyGammingLimit
    };

    return GenResObj(
      Code.CREATED,
      true,
      "User token info for game fetched successfully",
      resObj
    );
  } catch (error) {
    console.log("Getting error for getting user token info for gamming :", error);
    return GenResObj(
      Code.INTERNAL_SERVER,
      false,
      "Internal server error",
      null
    );
  }
};

export const updateUserTokenInfoForGame = async(req:AuthRequest) => {
  try {
    const { telegramId } = req;
    const { token , action } = req.body;

    if(action !== 'REMOVE' && action !== 'ADD') {
      return GenResObj(Code.BAD_REQUEST, false, 'Invalid action!');
    }
    const checkAvlUser = await User.findOne({
      where: { telegramId },
      raw: true,
    });

    const checkAvlUserTokenInfo:any = await UserTokenInfo.findOne({
      where : { userId : checkAvlUser?.id},
      // raw: true,
      // attributes: ["dailyGammingLimit"]
    });

    console.log("Getting the checkAvlUserTokenInfo", checkAvlUserTokenInfo)

    if(checkAvlUserTokenInfo?.dataValues?.dailyGammingLimit <= 0) {
        return GenResObj(Code.BAD_REQUEST, false, "No remaining bet for playing the game");
    };

    switch (action) {
      case "ADD":
        await checkAvlUserTokenInfo.increment('currentBalance', { by: token });
        break;

      case "REMOVE":
        await checkAvlUserTokenInfo.decrement('currentBalance', { by: token });
        break;
    
      default:
        break;
    };
    const currentTime = new Date();
    await checkAvlUserTokenInfo.decrement('dailyGammingLimit', { by: 1 });
    await checkAvlUserTokenInfo.update({ tankUpdateTime: currentTime});
    const updatedUserTokenInfo = await checkAvlUserTokenInfo.reload();

    return GenResObj(Code.ACCEPTED, true, "User token for game updated successfully", updatedUserTokenInfo);

  } catch (error) {
    console.log("Getting error for updating user token info for gamming :", error);
    return GenResObj(
      Code.INTERNAL_SERVER,
      false,
      "Internal server error",
      null
    );
  }
}
