"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const EnergyChargingLevel_controller_1 = require("./EnergyChargingLevel.controller");
const router = (0, express_1.Router)();
router.route('/add-level').post(EnergyChargingLevel_controller_1.LevelInfoController.addEnergyChargingLevel);
router.route('/get-level').get(EnergyChargingLevel_controller_1.LevelInfoController.getEnergyChargingLevel);
exports.default = router;
