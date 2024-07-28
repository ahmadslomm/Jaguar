import { StatusInfoController } from "./statusInfo.controller";
import { Router } from "express";
const router = Router();

router.route('/add-status').post(StatusInfoController.addStatusInfo);
router.route('/get-status').get(StatusInfoController.getStatusList);

export default router;