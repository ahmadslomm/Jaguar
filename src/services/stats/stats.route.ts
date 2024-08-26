import { Router } from "express";
import { StatsController } from './stats.controller';
import { authCheck } from "../../middleware/authentication/jsonToken";

const router = Router();

router.route('/get-stats-info').get(authCheck(), StatsController.getStatsInfo);

export default router;