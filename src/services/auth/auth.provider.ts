import { Request, Response } from 'express';
import User from "../../schema/user.schema";
import { GenResObj } from '../../utils/ResponseFormat';
import { HttpStatusCodes as Code } from '../../utils/Enum';

export const register = async (req:Request) => {
    try {
        console.log("Getting bosy ", req.body)
        const {email, phone, name} = req.body;
    
        const user = await User.findOneAndUpdate({phone}, {$set : {email, phone, name}}, { upsert : true, new : true});
    
        console.log("Getting user Info", user);     

        return GenResObj(Code.CREATED, true, "User managed successfully", user);
    } catch (error) {
        console.log("Getting error for user registration :", error);
        return GenResObj(Code.INTERNAL_SERVER, false, "Internal server error", null);
    }
};

export const getUserRegistration = async(req:Request) => {
    try {
        const userData = await User.find({});

        return GenResObj(Code.CREATED, true, "User details fetched successfully", userData);

    } catch (error) {
        console.log("Getting error for getting user registration :", error);
        return GenResObj(Code.INTERNAL_SERVER, false, "Internal server error", null);
    }
}