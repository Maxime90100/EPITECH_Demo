import { fileURLToPath } from 'url';
import path from "path";
import dotenv from "dotenv";
import express from "express";
import cors from "cors";
import router from "./routes/index.js";
import http from "http";
import { Server } from "socket.io";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.join(__dirname, '../.env') });

const PORT = process.env.SERVER_PORT;
const HOSTNAME = process.env.SERVER_HOSTNAME;
const URL = process.env.SERVER_URL;

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
    transports: ['websocket', 'polling'],
    cors: {
        origin: "*",
        methods: ["GET", "POST"],
    },
});

app.use(cors());
app.use('/', router);

io.on("connection", (socket) => {
    console.log("client connexion");

    socket.on("sensorData", (data) => {
        io.emit("sensorData", data);
    });

    socket.on("disconnect", () => {
        console.log("client deconnexion");
    });
});

server.listen(PORT, HOSTNAME, (err) => {
    if (err) {
        console.error(`ERROR: ${err}`);
    } else {
        console.log(`\t-> Network: ${URL}`);
    }
});
