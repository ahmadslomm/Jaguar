import { Request, Response } from 'express';
import * as ReferralProvicer from './task.provider';
import { TResponse } from '../../utils/Types';

export const TaskController = {
    getTaskInfo : async(req: Request, res: Response) => {
        const { code, data} : TResponse = await ReferralProvicer.getTaskInfo(req);
        res.status(code).json(data);
    },

    updateTaskStatus : async(req: Request, res: Response) => {
        const { code, data} : TResponse = await ReferralProvicer.updateTaskStatus(req);
        res.status(code).json(data);
    }

}


