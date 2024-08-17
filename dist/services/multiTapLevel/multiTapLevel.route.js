"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const multiTapLevel_controller_1 = require("./multiTapLevel.controller");
const router = (0, express_1.Router)();
router.route('/add-level').post(multiTapLevel_controller_1.LevelInfoController.addMultiTapLevel);
router.route('/get-level').get(multiTapLevel_controller_1.LevelInfoController.getMultiTapLevel);
exports.default = router;
