import express from "express";
import geographieRouter from "./geographie.js";

const router = express.Router();

router.use('/geographie',geographieRouter);

export default router;