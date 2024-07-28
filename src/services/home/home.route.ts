import { Router } from "express";
import { HomeController } from "./home.controller";
import { authCheck } from "../../middleware/authentication/jsonToken";

const router = Router();

router.route('/get-user-token-info').get(authCheck(), HomeController.getUserTokenInfo);
router.route('/add-token-to-balance').post(authCheck(),HomeController.addTokenbalance);

export default router;