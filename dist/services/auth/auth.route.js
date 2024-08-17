"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const auth_controller_1 = require("./auth.controller");
const router = (0, express_1.Router)();
router.route('/register').post(auth_controller_1.AuthController.register);
router.route('/get-users').get(auth_controller_1.AuthController.getUserRegistration);
exports.default = router;
