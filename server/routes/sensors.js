import express from "express";
import dotenv from "dotenv"; dotenv.config();
import {SensorData} from "../models/sensorData.js";
import {getIo} from "../services/socket.js"

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
sensorsRouter.post('/add', async (req, res) => {
    const {temperature,humidity} = req.body;
    const data = {
        temperature: temperature.toFixed(2),
        humidity: humidity.toFixed(2),
        timestamp: Date.now()
    }
    const newSensorData = new SensorData(data);
    try {
        await newSensorData.save();
        getIo().emit("sensorData", data);
    } catch (err) {
        console.error('Erreur lors de l\'enregistrement des données', err);
    }
    res.status(200).json({temperature,humidity});
});


export default sensorsRouter;