import { Response } from "express";
import { ReferralClaim } from "../../schema/referralClaim.schema";
import { User } from "../../schema/user.schema";
import { UserTokenInfo } from "../../schema/userTokenInfo.schema";
import { HttpStatusCodes as Code } from "../../utils/Enum";
import { GenResObj } from "../../utils/ResponseFormat";
import { AuthRequest } from "./../../middleware/authentication/jsonToken";
import { StatusInfo } from "../../schema/statusInfo.schema";
import { col } from "sequelize";

export const getLederBoardInfo = async (req: AuthRequest) => {
  try {
    const { telegramId } = req;

    const user = await User.findOne({ where: { telegramId } , raw: true});

    const checkAvlUserTokenInfo:any = await UserTokenInfo.findOne({
      where: { userId: user?.id },
      include: [
        {
          model: StatusInfo,
          attributes: [],
        },
      ],
      attributes: [[col('statusInfo.status'),'status'], "currentBalance","turnOverBalance"],
      raw: true,
    });

    console.log("Getting first", checkAvlUserTokenInfo )

    const topUserTokenInfos:any = await UserTokenInfo.findAll({
      // attributes: [],
      include: [
        {
          model: User,
          as: "userInfo",
          attributes: [],
        },
        {
          model: StatusInfo,
          attributes: [],
        },
      ],
      attributes: [
        "id",
        "userId",
        "turnOverBalance",
        [col("userInfo.id"), "userInfoId"],
        [col("userInfo.firstName"), "firstName"],
        [col("userInfo.lastName"), "lastName"],
        "statusInfo.status",
      ],
      order: [["turnOverBalance", "DESC"]],
      limit: 25,
      raw: true,
      subQuery: false,
    });

    // console.log("Getting into the topUserTokenInfios...", topUserTokenInfos);

    const teamData = topUserTokenInfos
      // .filter((info:any) => info.userId !== user?.id)
      .map((info: any) => ({
        name: `${!!info?.firstName ? info?.firstName : ""}${!!info?.lastName ? info?.lastName:""}`,
        level: info?.status || "Unknown",
        coins: info.turnOverBalance,
      })).filter((j:any)=>j.name!==null);
      

    const formattedResponse = {
      personalData: {
        name: `${!!user?.firstName? user?.firstName : ""}${!!user?.lastName ? user?.lastName: ""}`,
        level: checkAvlUserTokenInfo?.status,
        coins: checkAvlUserTokenInfo?.turnOverBalance,
      },
      teamData,
    };

    return GenResObj(
      Code.OK,
      true,
      "Learderboard details fetched successfully",
      formattedResponse
    );
  } catch (error) {
    console.log("Getting error for getting leaderboard info: " + error);
    return GenResObj(
      Code.INTERNAL_SERVER,
      false,
      "Internal server error",
      null
    );
  }
};
