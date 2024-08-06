import { Router } from 'express';
import AuthRoute from './services/auth/auth.route';
// import LevelInfoRoute from './services/levelInfo/levelInfo.route';
import MultiTapLevelRoute from './services/multiTapLevel/multiTapLevel.route';
import EnergyTankLevelRoute from './services/energyTankLevel/energyTankLevel.route';
import EnergyChargingLevelRoute from './services/EnergyChargingLevel/EnergyChargingLevel.route';
import StatusInfoRoute from './services/statusInfo/statusInfo.route';
import HomeRoute from './services/home/home.route';
import BoosterRoute from './services/booster/booster.route';
import ReferralRoute from './services/referrals/referrals.route';
import LeaderboardRoute from './services/leaderboard/leaderboard.router';

const router = Router();

router.use('/auth', AuthRoute);
// router.use('/level', LevelInfoRoute);
router.use('/multiTapLevel', MultiTapLevelRoute);
router.use('/energyTankLevel', EnergyTankLevelRoute);
router.use('/energyChargingLevel', EnergyChargingLevelRoute);
router.use('/status', StatusInfoRoute);
router.use('/home', HomeRoute);
router.use('/booster', BoosterRoute);
router.use('/referral',ReferralRoute);
router.use('/leaderboard', LeaderboardRoute);

export default router;