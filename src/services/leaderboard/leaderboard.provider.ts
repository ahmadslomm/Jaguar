import { Response } from "express";
import { ReferralClaim } from "../../schema/referralClaim.schema";
import { User } from "../../schema/user.schema";
import { UserTokenInfo } from "../../schema/userTokenInfo.schema";
import { HttpStatusCodes as Code } from "../../utils/Enum";
import { GenResObj } from "../../utils/ResponseFormat";
import { AuthRequest } from "./../../middleware/authentication/jsonToken";
import { StatusInfo } from "../../schema/statusInfo.schema";

export const getLederBoardInfo = async (req: AuthRequest) => {
    try {
        const { telegramId } = req ;

        const user = await User.findOne({ where : { telegramId }});

        const checkAvlUserTokenInfo = await UserTokenInfo.findOne(
            { where : { userId : user?.id },
            attributes: ['statusId', 'currentBalance'],
            include :[
                {
                    model : StatusInfo,
                    attributes : ['status']
                }
            ]
        })

        const topUserTokenInfos = await UserTokenInfo.findAll({
            attributes: ['id', 'userId', 'currentBalance'],
            include: [
              {
                model: User,
                as: 'userInfo',
                attributes: ['id','firstName', 'lastName']
              },
              {
                model: StatusInfo,
                attributes: ['status']
              }
            ],
            order: [['currentBalance', 'DESC']],
            limit: 50
          });

          const teamData = topUserTokenInfos
          .filter(info => info.userId !== user?.id)
          .map(info => ({
            name: `${info.userInfo?.firstName}${info.userInfo?.lastName}`,
            level: info.statusInfo?.status || "Unknown",
            coins: info.currentBalance,
          }));

          const formattedResponse = {
            personalData : {
                name : `${user?.firstName}${user?.lastName}`,
                level : checkAvlUserTokenInfo?.statusInfo?.status,
                coins : checkAvlUserTokenInfo?.currentBalance
            },
            teamData
          }
      
          return GenResObj(Code.OK, true, "Learderboard details fetched successfully", formattedResponse);
      
    } catch (error) {
        console.log("Getting error for getting leaderboard info: " + error);
    return GenResObj(
      Code.INTERNAL_SERVER,
      false,
      "Internal server error",
      null
    );
    }
}