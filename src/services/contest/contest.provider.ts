import { Request, Response } from "express";
import { AuthRequest } from "./../../middleware/authentication/jsonToken";
import { User } from "../../schema/user.schema";
import { UserTokenInfo } from "../../schema/userTokenInfo.schema";
import { col, literal, Sequelize } from "sequelize";
import { ReferralClaim } from "../../schema/referralClaim.schema";
import { HttpStatusCodes as Code } from "../../utils/Enum";
import { GenResObj } from "../../utils/ResponseFormat";
import { StatusInfo } from "../../schema/statusInfo.schema";

export const getContestUserList = async (req: AuthRequest) => {
  try {
    const { telegramId } = req;
    const user = await User.findOne({ where: { telegramId }, raw: true });

    const userReferralCount = await ReferralClaim.count({
        where: { referrerId: user?.id },
      });

    const checkAvlUserTokenInfo: any = await UserTokenInfo.findOne({
      where: { userId: user?.id },
      include: [
        {
          model: StatusInfo,
          attributes: [],
        },
      ],
      attributes: [
        [col("statusInfo.status"), "status"],
        "currentBalance",
        "turnOverBalance",
      ],
      raw: true,
    });

    const topReferrers:any = await ReferralClaim.findAll({
      attributes: [
        "referrerId",
        [Sequelize.fn("COUNT", Sequelize.col("referrerId")), "referralCount"],
      ],
      include: [
        {
          model: User,
          as: "referrer",
          attributes: ["firstName", "lastName"], // Include first and last name of the referrer
        },
      ],
      group: ["referrerId", "referrer.id"], // Group by referrerId and referrer user fields
      order: [[Sequelize.literal("referralCount"), "DESC"]], // Order by referral count in descending order
      limit: 50, // Limit to the top 50 referrers
      raw : true
    });

    const rankedReferrers:any = topReferrers.map((referrer:any, index:any) => ({
        ...referrer,
        rank: index + 1, // Assign rank based on position in the array (1-based index)
      }));

    const formattedResponse = {
        personalData: {
            name: `${!!user?.firstName? user?.firstName : ""}${!!user?.lastName ? user?.lastName: ""}`,
            level: checkAvlUserTokenInfo?.status,
            coins: checkAvlUserTokenInfo?.turnOverBalance,
            userReferralCount
          },
          topReferrers : rankedReferrers
    }

    return GenResObj(
      Code.OK,
      true,
      "User list fetched successfully.",
      formattedResponse
    );
  } catch (error) {
    console.log("Getting error for getting user context list :", error);
    return GenResObj(
      Code.INTERNAL_SERVER,
      false,
      "Internal server error",
      null
    );
  }
};
