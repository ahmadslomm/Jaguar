import { Router } from 'express';
import AuthRoute from './services/auth/auth.route';
import LevelInfoRoute from './services/levelInfo/levelInfo.route';
import MultiTapLevelRoute from './services/multiTapLevel/multiTapLevel.route';
import EnergyTankLevelRoute from './services/energyTankLevel/energyTankLevel.route';
import EnergyChargingLevelRoute from './services/EnergyChargingLevel/EnergyChargingLevel.route';
import StatusInfoROute from './services/statusInfo/statusInfo.route';
import HomeRoute from './services/home/home.route';
import BoosterRoute from './services/booster/booster.route';

const router = Router();

router.use('/auth', AuthRoute);
router.use('/level', LevelInfoRoute);
router.use('/multiTapLevel', MultiTapLevelRoute);
router.use('/energyTankLevel', EnergyTankLevelRoute);
router.use('/energyChargingLevel', EnergyChargingLevelRoute);
router.use('/status', StatusInfoROute);
router.use('/home', HomeRoute);
router.use('/booster', BoosterRoute);

export default router;