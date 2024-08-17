"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const levelInfo_controller_1 = require("./levelInfo.controller");
const router = (0, express_1.Router)();
router.route('/add-level').post(levelInfo_controller_1.LevelInfoController.addLevel);
router.route('/get-level').get(levelInfo_controller_1.LevelInfoController.getLevel);
exports.default = router;
