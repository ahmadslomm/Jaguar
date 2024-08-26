import { Request, Response } from 'express';
import * as StatsProvider from './stats.provider';
import { TResponse } from '../../utils/Types';

export const StatsController = {
    getStatsInfo : async(req: Request, res: Response) => {
        const { code, data} : TResponse = await StatsProvider.getStatsInfo(req);
        res.status(code).json(data);
        return;
    }
}