"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const home_controller_1 = require("./home.controller");
const jsonToken_1 = require("../../middleware/authentication/jsonToken");
const router = (0, express_1.Router)();
router.route('/get-user-token-info').get((0, jsonToken_1.authCheck)(), home_controller_1.HomeController.getUserTokenInfo);
router.route('/add-token-to-balance').post((0, jsonToken_1.authCheck)(), home_controller_1.HomeController.addTokenbalance);
exports.default = router;
