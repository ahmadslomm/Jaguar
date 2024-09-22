import jwt from "jsonwebtoken";
import { Request, Response, NextFunction } from "express";
import { User } from "../../schema/user.schema";
import { HttpStatusCodes as Code } from "../../utils/Enum";
import { GenResObj } from "../../utils/ResponseFormat";
import { ObjectId } from "mongoose";

export interface AuthRequest extends Request {
  userId?: string | ObjectId;
  telegramId?: string;
}

const allowedOrigins = [
  "https://frontend.flipcoingame.xyz",
  "https://coin-mining.vercel.app",
];

const checkOrigin = (req: Request, res: Response) => {
  const origin = req.headers["origin"] || req.headers["referer"];
  if (!origin || !allowedOrigins.includes(origin)) {
    return res.status(Code.FORBIDDEN).json({
      success: false,
      message: "Forbidden: Invalid request origin",
      data: null,
    });
  }
};

export const authCheck = () => {
  return async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
      // checkOrigin(req, res);

      const origin = req.headers["origin"] || req.headers["referer"];
      console.log("Getting the originnnnnnnnnnnnnnnnnn", origin);
    //   if (!origin || !allowedOrigins.includes(origin)) {
    //     return res.status(Code.FORBIDDEN).json({
    //       success: false,
    //       message: "Forbidden: Invalid request origin",
    //       data: null,
    //     });
    //   }

      let jwtToken;

      if (
        req.headers.authorization &&
        req.headers.authorization.startsWith("Bearer")
      ) {
        jwtToken = req.headers.authorization.split(" ")[1];
      }
      // console.log("2")

      if (!jwtToken) {
        return res.status(Code.UNAUTHORIZED).json({
          success: false,
          message: "Access token not found",
          data: null,
        });
      }

      const secretKey: any = process.env.JWT_SECRET_KEY;

      jwt.verify(jwtToken, secretKey, async (err: any, decoded: any) => {
        if (err) {
          return res.status(Code.UNAUTHORIZED).json({
            success: false,
            message: "Invalid token",
            data: null,
          });
        } else {
          if (decoded !== null) {
            const user = await User.findOne({
              where: { telegramId: decoded?.telegramId },
              raw: true,
            });
            if (!user) {
              return res.status(Code.UNAUTHORIZED).json({
                success: false,
                message: "User not found",
                data: null,
              });
            }

            // console.log("object: ", user )

            req.userId = user?.id;
            req.telegramId = user?.telegramId;

            next();
          } else {
            return res.status(Code.NOT_FOUND).json({
              success: false,
              message: "Telegram ID not found",
              data: null,
            });
          }
        }
      });
    } catch (error) {
      console.log("Getting error for checking auth middleware :", error);
      return GenResObj(
        Code.INTERNAL_SERVER,
        false,
        "Internal server error",
        null
      );
    }
  };
};
