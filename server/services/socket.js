import { Server } from "socket.io";
import { SensorData } from '../models/sensorData.js';

export default function initializeSocket(server) {
    const io = new Server(server, {
        transports: ['websocket', 'polling'],
        cors: {
            origin: "*",
            methods: ["GET", "POST"],
        },
    });

    io.on("connection", (socket) => {
        console.log("client connexion");

        socket.on("sensorData", async (data) => {
            io.emit("sensorData", data);
            const newSensorData = new SensorData({
                temperature: data.temperature,
                humidity: data.humidity,
                timestamp: data.timestamp
            });
            try {
                await newSensorData.save();
            } catch (err) {
                console.error('Erreur lors de l\'enregistrement des données', err);
            }
        });

        socket.on("disconnect", () => {
            console.log("client deconnexion");
        });
    });
}
