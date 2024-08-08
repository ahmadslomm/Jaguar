import { Router } from "express";
import { TaskController } from "./task.controller";
import { authCheck } from "../../middleware/authentication/jsonToken";

const router = Router();

router.route('/get-task-info').get(authCheck(),TaskController.getTaskInfo)
router.route('/update-task-status').post(authCheck(),TaskController.updateTaskStatus)

export default router;

