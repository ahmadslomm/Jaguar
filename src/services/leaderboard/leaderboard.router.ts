import {Router} from 'express';
import { LeaderboardController } from './leaderboard.controller';
import { authCheck } from '../../middleware/authentication/jsonToken';

const router = Router();

router.route('/get-lederboard-info').get(authCheck(), LeaderboardController.getLederBoardInfo);

export default router;