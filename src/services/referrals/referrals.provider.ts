import { Request, Response } from "express";
import { AuthRequest } from "./../../middleware/authentication/jsonToken";
import { User } from "../../schema/user.schema";
import LevelInfo from "../../schema/levelInfo.schema";
import { StatusInfo } from "../../schema/statusInfo.schema";
import { UserTokenInfo } from "../../schema/userTokenInfo.schema";
import { HttpStatusCodes as Code } from "../../utils/Enum";
import { GenResObj } from "../../utils/ResponseFormat";
import { calculateEnergyTankBalance } from "../../helper/function";
import { Types } from "mongoose";
import { literal } from "sequelize";
import { ReferralClaim } from "../../schema/referralClaim.schema";

export const getReferralInfo = async (req: AuthRequest) => {
  try {
    const { telegramId } = req;

    const user = await User.findOne({ where: { telegramId: telegramId }, raw: true });
    // console.log("USer", user);
    const referralCode = user?.referralCode;

    const invitationLink = `${process.env.REFERRAL_URL}?start=${referralCode}`;

    const datas = await ReferralClaim.findAll({ where : { referrerId: user?.id } });

    // console.log("Getingv datas", datas)

    const referralClaims:any = await ReferralClaim.findAll({
      where: { referrerId: user?.id },
      include: [
        {
          model: User,
          as: "referredUser",
          attributes: ["firstName", "lastName"],
          include: [
            {
              model: UserTokenInfo,
              attributes: [],
              include: [
                {
                  model: StatusInfo,
                  attributes: ["status"],
                },
              ],
            },
          ],
        },
       ],
       attributes: [
        "id", 
        "referralAmount", 
        "claimed"
      ],
      raw : true,
      nest : true
    });

    let totalCoin = 0;

    // console.log("referralClaims *********************", referralClaims)

    const formattedReferralClaims = referralClaims.map((referralClaim: any) => {
      // console.dir(referralClaim.referredUser.userTokenInfos[0], { depth : null} );
      // console.log("Getting the referred user name", referralClaim.referredUser)
      // console.log("Getting the status name", referralClaim?.referredUser.userTokenInfos?.statusInfo.status)
      const { firstName, lastName } = referralClaim.referredUser;
      const status =
        referralClaim?.referredUser?.userTokenInfos?.statusInfo.status 
          ? referralClaim?.referredUser.userTokenInfos?.statusInfo.status
          : null;

          totalCoin = totalCoin + referralClaim.referralAmount

      return {
        name : `${firstName} ${lastName} `,
        level : status,
        coins : referralClaim.referralAmount,
        // id: referralClaim.id,
        // referralAmount: referralClaim.referralAmount,
        // claimed: referralClaim.claimed,
        // referredUser: {
        //   firstName,
        //   lastName,
        //   status,
        // },
      };
    });

    const formattedResponse = {
      invitationLink,
      teamTotalCoins : totalCoin,
      team: formattedReferralClaims
    }

    return GenResObj(
      Code.OK,
      true,
      "Referral info fetched successfully",
      formattedResponse
    );
  } catch (error) {
    console.log("Getting error for getting referral info: " + error);
    return GenResObj(
      Code.INTERNAL_SERVER,
      false,
      "Internal server error",
      null
    );
  }
};

export const claimReferralAmount = async (req: AuthRequest) => {
  try {
    const { telegramId } = req;

    const { referralRecordId } = req.body;

    const checkAvlReferralRecord = await ReferralClaim.findOne({
      where: { id: referralRecordId },
    });

    if (checkAvlReferralRecord?.claimed)
      return GenResObj(
        Code.BAD_REQUEST,
        false,
        "Referral amount already claimed",
        null
      );
    if (checkAvlReferralRecord) {
      const referralClaim = await ReferralClaim.update(
        { claimed: true, referralStatus: "CLAIMED" },
        { where: { id: referralRecordId } }
      );

      const updateUserTokenInfo = await UserTokenInfo.update(
        {
          currentBalance: literal(
            `currentBalance + ${checkAvlReferralRecord.referralAmount}`
          ),
          turnOverBalance: literal(
            `turnOverBalance + ${checkAvlReferralRecord.referralAmount}`
          ),
        },
        { where: { userId: checkAvlReferralRecord.referrerId } }
      );
      return GenResObj(
        Code.OK,
        true,
        "Referral amount claimed successfully",
        referralClaim
      );
    }

    return GenResObj(Code.NOT_FOUND, false, "Something went wrong");
  } catch (error) {
    console.log("Getting error for claiming referral amount :", error);
    return GenResObj(
      Code.INTERNAL_SERVER,
      false,
      "Internal server error",
      null
    );
  }
};
