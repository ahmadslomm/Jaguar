import { Router } from "express";
import { BoosterController } from "./booster.controller";
import { authCheck } from "../../middleware/authentication/jsonToken";

const router = Router();

router.route('/get-booster-info').get(authCheck(),BoosterController.getBoosterInfo);
router.route('/update-daily-booster').post(authCheck(),BoosterController.updateDailyBooster);
router.route('/update-level').post(authCheck(),BoosterController.updatelevel);

export default router;