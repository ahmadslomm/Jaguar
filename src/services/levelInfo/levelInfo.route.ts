import { Router } from "express";
import { LevelInfoController } from "./levelInfo.controller";

const router = Router();

router.route('/add-level').post(LevelInfoController.addLevel);
router.route('/get-level').get(LevelInfoController.getLevel);

export default router;
