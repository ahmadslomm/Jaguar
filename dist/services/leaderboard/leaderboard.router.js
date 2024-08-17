"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const leaderboard_controller_1 = require("./leaderboard.controller");
const jsonToken_1 = require("../../middleware/authentication/jsonToken");
const router = (0, express_1.Router)();
router.route('/get-lederboard-info').get((0, jsonToken_1.authCheck)(), leaderboard_controller_1.LeaderboardController.getLederBoardInfo);
exports.default = router;
