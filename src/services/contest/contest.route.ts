import { Router } from "express";
import { ContextController } from "./contest.controller";
import { authCheck } from "../../middleware/authentication/jsonToken";

const router = Router();

router.route('/get-contest-user-list').get( authCheck(), ContextController.getContestUserList);

export default router;