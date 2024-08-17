"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const task_controller_1 = require("./task.controller");
const jsonToken_1 = require("../../middleware/authentication/jsonToken");
const router = (0, express_1.Router)();
router.route('/get-task-info').get((0, jsonToken_1.authCheck)(), task_controller_1.TaskController.getTaskInfo);
router.route('/update-task-status').post((0, jsonToken_1.authCheck)(), task_controller_1.TaskController.updateTaskStatus);
exports.default = router;
