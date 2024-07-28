import { Router } from "express";
import { LevelInfoController } from "./EnergyChargingLevel.controller";

const router = Router();

router.route('/add-level').post(LevelInfoController.addEnergyChargingLevel);
router.route('/get-level').get(LevelInfoController.getEnergyChargingLevel);

export default router;
