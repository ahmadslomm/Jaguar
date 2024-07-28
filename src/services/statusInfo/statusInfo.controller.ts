import { Request, Response } from "express";
import * as StatusInfoProvider from './statusInfo.provider';
import { TResponse } from "../../utils/Types";

export const StatusInfoController = {
    addStatusInfo : async(req: Request, res: Response) => {
        const { code, data }: TResponse = await StatusInfoProvider.addStatusInfo(req);
        res.status(code).json(data);
        return;
    },
    
    getStatusList : async(req: Request, res: Response) => {
        const { code, data }: TResponse = await StatusInfoProvider.getStatusList();
        res.status(code).json(data);
        return;
    }
}