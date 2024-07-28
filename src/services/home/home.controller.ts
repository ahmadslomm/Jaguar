import { Request, Response } from 'express';
import * as HomeProvider from './home.provider';
import { TResponse } from '../../utils/Types';

export const HomeController = {
    getUserTokenInfo :async (req: Request, res: Response) => {
        const { code, data }: TResponse = await  HomeProvider.getUserTokenInfo(req);
        res.status(code).json(data);
        return;
    },

    addTokenbalance : async ( req: Request, res: Response) => {
        const { code, data }: TResponse = await HomeProvider.addTokenbalance(req);
        res.status(code).json(data);
        return;
    },
}
