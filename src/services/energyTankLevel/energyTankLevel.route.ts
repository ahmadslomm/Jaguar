import { Router } from "express";
import { LevelInfoController } from "./energyTankLevel.controller";

const router = Router();

router.route('/add-level').post(LevelInfoController.addEnergyTankLevel);
router.route('/get-level').get(LevelInfoController.getEnergyTankLevel);

export default router;
