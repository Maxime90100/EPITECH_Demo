import express from "express";
import geographieRouter from "./geographie.js";
import sensorsRouter from "./sensors.js";
import authRouter from "./auth/index.js";
import authenticateRouter from "./authenticate/index.js";

const router = express.Router();

router.use('/geographie',geographieRouter);
router.use('/sensors',sensorsRouter);

router.use('/auth',authRouter);
router.use('/authenticate',authenticateRouter);

export default router;