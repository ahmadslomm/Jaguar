import { Router } from "express";
import { BoosterController } from "./booster.controller";


const router = Router();

router.route('/get-booster-info').get(BoosterController.getBoosterInfo);
router.route('/update-daily-booster').post(BoosterController.updateDailyBooster);

export default router;