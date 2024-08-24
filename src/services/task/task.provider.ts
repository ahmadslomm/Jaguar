import { Request, Response } from "express";
import { AuthRequest } from "./../../middleware/authentication/jsonToken";
import { User } from "../../schema/user.schema";
import LevelInfo from "../../schema/levelInfo.schema";
import { StatusInfo } from "../../schema/statusInfo.schema";
import { UserTokenInfo } from "../../schema/userTokenInfo.schema";
import { HttpStatusCodes as Code } from "../../utils/Enum";
import { GenResObj } from "../../utils/ResponseFormat";
import { getLeagueTrekInfo, getReferralTrekInfo, getSocialMediaTrekInfo, updateLeagueTrek, updateReferTrek, updateSocialTrek } from "../../helper/function";

export const getTaskInfo = async (req: AuthRequest) => {
  try {
    const { telegramId } = req;
    console.log("object is " , telegramId);

    const user = await User.findOne({ where: { telegramId: telegramId } });
    const checkAvlUserTokenInfo = await UserTokenInfo.findOne(
      { where : { userId : user?.id },
      raw : true,
      attributes: ['statusId', 'currentBalance', 'turnOverBalance'],
      include :[
        {
          model : StatusInfo,
          attributes : ['status']
        }
      ]
    });
    // console.log("Getting the staticIDs of the", checkAvlUserTokenInfo?.statusId)
    // console.log("userid is " , user?.id, checkAvlUserTokenInfo, checkAvlUserTokenInfo?.statusId)
    
    if(user && checkAvlUserTokenInfo?.statusId) {
        const socialMediaTasks = await getSocialMediaTrekInfo(user?.id);
        const referrealTrek = await getReferralTrekInfo(user?.id);
        const leagueTrek = await getLeagueTrekInfo(user?.id, checkAvlUserTokenInfo?.statusId, checkAvlUserTokenInfo?.turnOverBalance);

        const responseObj = {
          totalCoins : checkAvlUserTokenInfo?.currentBalance,
          totalTurnOverBalance : checkAvlUserTokenInfo?.turnOverBalance,
          social : socialMediaTasks,
          refer : referrealTrek,
          league : leagueTrek
        }
        return GenResObj(Code.OK, true, "Task info get successfully", responseObj)
    };


    return GenResObj(Code.NOT_FOUND, false, "User not found", null);
  } catch (error) {
    console.log("Getting error for getting task info: " + error);
    return GenResObj(
      Code.INTERNAL_SERVER,
      false,
      "Internal server error",
      null
    );
  }
};

export const updateTaskStatus = async(req: AuthRequest) => {
  try {
    const { telegramId, userId } = req;

    const  { section, ...payload } = req.body;
    let updatedRecord:any;

    switch (section) {
        case 'social':
            updatedRecord = await updateSocialTrek({ ...payload, userId, telegramId });
            break;
        case 'refer':
            updatedRecord = await updateReferTrek({ ...payload, userId, telegramId })
            break;
        case 'league':
            updatedRecord = await updateLeagueTrek({ ...payload, userId, telegramId })
            break;
        default:
            break;
    };

    return GenResObj(Code.OK, true, "Task info get successfully", updatedRecord)
  } catch (error) {
    console.log("Getting error for getting task info: " + error);
    return GenResObj(
      Code.INTERNAL_SERVER,
      false,
      "Internal server error",
      null
    );
  }
}

