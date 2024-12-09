import express from 'express';
import mongoose from 'mongoose';
import morgan from 'morgan';
import dotenv from 'dotenv';
import cors from 'cors';
import fs from 'fs';
import path from 'path';
import { router } from './routes/routes';

const app = express()
dotenv.config()

const corsOptions = {
    origin: process.env.FRONTEND_URL,
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'],
    credentials: true,
    allowHeaders: 'Content-Type,Authorization',

};

const logDir = path.join(__dirname, 'logs');
if (!fs.existsSync(logDir)) {
    fs.mkdirSync(logDir);
}

const logStream = fs.createWriteStream(path.join(logDir, 'access.log'), { flags: 'a' });
const PORT = process.env.PORT;

app.use(morgan('combined'));
app.use(morgan('combined', { stream: logStream }));
app.use(cors(corsOptions));
app.use(express.json())
app.use('/uploads', express.static(path.join(__dirname, '../src/public/uploads')));
app.use('/', router);

mongoose.connect(process.env.MONGODB_URL)
    .then(() => console.log('Connected to MongoDB'))
    .catch(error => console.log('Error connecting to MongoDB', error));

app.listen(PORT, () => {
    console.log(`Server running on PORT ${PORT}`)
})