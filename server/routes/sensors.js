import express from "express";
import dotenv from "dotenv";
import {SensorData} from "../models/sensorData.js"; dotenv.config();

const sensorsRouter = express.Router();

sensorsRouter.get('/data', async (req, res) => {
    SensorData.find().select('temperature humidity timestamp').exec()
        .then(result => {
            res.send(result);
        })
        .catch(error => {
            console.error("Erreur lors de la récupération des données : ", error);
            res.send([]);
        })
});
sensorsRouter.get('/data/delete', async (req, res) => {
    SensorData.deleteMany({})
        .then(result => {
            const deletedCount = result.deletedCount;
            console.log(`Supprimé ${deletedCount} documents.`);
            res.status(200).json({ deletedCount });
        })
        .catch(error => {
            console.error("Erreur lors de la suppression : ", error);
            res.status(500).json({ error: "Erreur lors de la suppression" });
        });
});


export default sensorsRouter;