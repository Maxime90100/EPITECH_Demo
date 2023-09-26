import { fileURLToPath } from 'url';
import path from "path";
import dotenv from "dotenv";
import express from "express";
import cors from "cors";
import router from "./routes/index.js";
import http from "http";
import initializeSocket from "./services/socket.js";
import mongoose from "mongoose";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.join(__dirname, '../.env') });

mongoose.connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
})
    .then(() => {
        console.log('MongoDB Connected');
    })
    .catch(err => {
        console.error('MongoDB Connection Error', err);
    });

const app = express();
const server = http.createServer(app);
initializeSocket(server)

app.use(cors());
app.use('/', router);

server.listen(process.env.SERVER_PORT, process.env.SERVER_HOSTNAME, (err) => {
    if (err) {
        console.error(`ERROR: ${err}`);
    } else {
        console.log(`\t-> Network: ${process.env.SERVER_URL}`);
    }
});
