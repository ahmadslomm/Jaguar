import { Router } from "express";
import { ReferralController } from "./referrals.controller";
import { authCheck } from "../../middleware/authentication/jsonToken";

const router = Router();

router.route('/get-referral-info').get(authCheck(), ReferralController.getReferralInfo);
router.route('/claim-referral-amount').post(authCheck(),ReferralController.claimReferralAmount);

export default router;