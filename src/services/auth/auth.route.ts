import { Router } from "express";
import { AuthController } from "./auth.controller";

const router = Router();

router.route('/register').post(AuthController.register);

router.route('/get-users').get(AuthController.getUserRegistration)

export default router;