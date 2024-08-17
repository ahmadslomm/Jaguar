"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const referrals_controller_1 = require("./referrals.controller");
const jsonToken_1 = require("../../middleware/authentication/jsonToken");
const router = (0, express_1.Router)();
router.route('/get-referral-info').get((0, jsonToken_1.authCheck)(), referrals_controller_1.ReferralController.getReferralInfo);
router.route('/claim-referral-amount').post((0, jsonToken_1.authCheck)(), referrals_controller_1.ReferralController.claimReferralAmount);
exports.default = router;
