import { Router } from "express";
import { LevelInfoController } from "./multiTapLevel.controller";

const router = Router();

router.route('/add-level').post(LevelInfoController.addMultiTapLevel);
router.route('/get-level').get(LevelInfoController.getMultiTapLevel);

export default router;
