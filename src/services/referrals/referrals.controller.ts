import { Request, Response } from 'express';
import * as ReferralProvicer from './referrals.provider';
import { TResponse } from '../../utils/Types';

export const ReferralController = {
    getReferralInfo : async (req: Request, res: Response) => {
        const {code, data}: TResponse = await ReferralProvicer.getReferralInfo(req);
        res.status(code).json(data);
    },

    claimReferralAmount : async (req: Request, res: Response) => {
        const {code, data}: TResponse = await ReferralProvicer.claimReferralAmount(req);
        res.status(code).json(data);
    }
}