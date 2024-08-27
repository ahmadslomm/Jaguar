import { Router } from "express";
import { FlipCoinController } from "./flip-coin.controller";
import { authCheck } from "../../middleware/authentication/jsonToken";

const router = Router();

router.route('/get-user-flip-token-info').get(authCheck(), FlipCoinController.getUserFlipTokenInfo);
router.route('/add-user-flip-token').post(authCheck(), FlipCoinController.addUserFlipToken);

export default router;