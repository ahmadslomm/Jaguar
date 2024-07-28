import { Router } from "express";
import { HomeController } from "./home.controller";

const router = Router();

router.route('/get-user-token-info').get(HomeController.getUserTokenInfo);
router.route('/add-token-to-balance').post(HomeController.addTokenbalance);

export default router;