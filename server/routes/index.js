import express from "express";
import geographieRouter from "./geographie.js";
import sensorsRouter from "./sensors.js";

const router = express.Router();

router.use('/geographie',geographieRouter);
router.use('/sensors',sensorsRouter);

export default router;