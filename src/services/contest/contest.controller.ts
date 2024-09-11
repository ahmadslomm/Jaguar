import { Request, Response } from "express";
import * as ContextProvider from './contest.provider';
import { TResponse } from "../../utils/Types";

export const ContextController = {

    getContestUserList : async(request: Request, response: Response) => {
        const { code, data}: TResponse = await ContextProvider.getContestUserList(request);
        response.status(code).json(data);
        return
    }
}