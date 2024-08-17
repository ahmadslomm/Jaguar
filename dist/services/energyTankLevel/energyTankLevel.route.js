"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const energyTankLevel_controller_1 = require("./energyTankLevel.controller");
const router = (0, express_1.Router)();
router.route('/add-level').post(energyTankLevel_controller_1.LevelInfoController.addEnergyTankLevel);
router.route('/get-level').get(energyTankLevel_controller_1.LevelInfoController.getEnergyTankLevel);
exports.default = router;
