import { Request, Response } from 'express';
import * as AuthProvider from './auth.provider';
import { GenResObj } from '../../utils/ResponseFormat';
import { TResponse } from '../../utils/Types';

export const AuthController =  {

    register : async (req:Request, res:Response) => {
        const { code, data }: TResponse = await AuthProvider.register(req);
        res.status(code).json(data);
        return;
    },

    getUserRegistration : async ( req:Request, res:Response) =>  {
        const { code, data }: TResponse = await AuthProvider.getUserRegistration(req);
        res.status(code).json(data);
        return;
    }

}
