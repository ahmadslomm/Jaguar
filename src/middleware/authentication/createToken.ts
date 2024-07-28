import jwt from 'jsonwebtoken';
import { ObjectId } from 'mongoose';

export const createJsonWebToken = async(userInfo : { telegrameId : string, userId? : ObjectId| unknown | string | null}) => {
    try {
        const maxAge = 30 * 24 * 60 * 60; //valid for 30days
        const secretKey: any = process.env.JWT_SECRET_KEY;
        const token = await jwt.sign(userInfo, secretKey, {
            expiresIn: maxAge,
        });
        return `Bearer ${token}`;
    } catch (error) {
        console.log("Getting error for creating json web token : ", error);
    throw error;
    }
}