import jwt from "jsonwebtoken";
import { Request, Response, NextFunction } from "express";
import User from "../../schema/user.schema";
import { HttpStatusCodes as Code } from "../../utils/Enum";
import { GenResObj } from "../../utils/ResponseFormat";
import { ObjectId } from "mongoose";

export interface AuthRequest extends Request  {
    userId? : string | ObjectId,
    telegramId? : string
};

export const authCheck = () => {
    return async (req: AuthRequest, res: Response, next: NextFunction) => {
        try {
            let jwtToken;

            if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
                jwtToken = req.headers.authorization.split(' ')[1];
            };

            if (!jwtToken) {
                return res.status(Code.UNAUTHORIZED).json({
                    success: false,
                    message: "Access token not found",
                    data: null
                })
            };

            const secretKey: any = process.env.JWT_SECRET_KEY;

            jwt.verify(jwtToken, secretKey, async (err:any, decoded : any) => {
                if (err) {
                    return res.status(Code.UNAUTHORIZED).json({
                        success: false,
                        message: "Invalid token",
                        data: null
                    })
                } else {
                    
                    const user:any = await User.findOne({ telegramId : decoded.telegrameId });
                    if (!user) {
                        return res.status(Code.UNAUTHORIZED).json({
                            success: false,
                            message: "User not found",
                            data: null
                        })
                    };

                    req.userId = user?._id;
                    req.telegramId = user?.telegramId;
        
                    next();
                }
            })

        } catch (error) {
            console.log("Getting error for checking auth middleware :", error);
            return GenResObj(
              Code.INTERNAL_SERVER,
              false,
              "Internal server error",
              null
            );
        }
    }
}