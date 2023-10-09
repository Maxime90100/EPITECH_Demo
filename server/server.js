import { fileURLToPath } from 'url';
import path from 'path';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import express from 'express';
import bodyParser from 'body-parser';
import cookieParser from 'cookie-parser';
import session from 'express-session';
import passport from './services/passport.js';
import cors from 'cors';
import router from './routes/index.js';
import http from 'http';
import initializeSocket from './services/socket.js';

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
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.json());
app.use(cookieParser());

app.use(
    session({
        secret: 'secret',
        resave: false,
        saveUninitialized: true,
        cookie: { secure: false }
    })
);

app.use(passport.initialize());
app.use(passport.session());

app.use(cors({
    origin: process.env.VUE_APP_URL,
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
}));

app.use('/', router);

const server = http.createServer(app);
initializeSocket(server);

server.listen(process.env.SERVER_PORT, process.env.SERVER_HOSTNAME, (err) => {
    if (err) {
        console.error(`ERROR: ${err}`);
    } else {
        console.log(`\t-> Network: ${process.env.SERVER_URL}`);
    }
});