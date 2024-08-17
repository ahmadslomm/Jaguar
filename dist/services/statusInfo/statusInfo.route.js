"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const statusInfo_controller_1 = require("./statusInfo.controller");
const express_1 = require("express");
const router = (0, express_1.Router)();
router.route('/add-status').post(statusInfo_controller_1.StatusInfoController.addStatusInfo);
router.route('/get-status').get(statusInfo_controller_1.StatusInfoController.getStatusList);
exports.default = router;
