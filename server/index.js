import express from 'express';
const logger = require('morgan')
var cors = require('cors')
require('dotenv').config()

import dbConnect from './utils/mongoDb';
import lotteryRouter from "./routes"

const app = express();
app.use(cors({
    origin: "*",
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'HEAD', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Origin', 'X-Requested-With', 'Accept', 'x-client-key', 'x-client-token', 'x-client-secret', 'Authorization'],
    credentials: true
}))

app.use((req, res, next) => {
    res.header("Access-Control-Allow-Origin", "*"); // update to match the domain you will make the request from
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content- Type, Accept");
    next();
});

app.get('/', (req, res) => {
    res.send('DLottery backend running');
})

dbConnect();

app.use(logger('dev'))
app.use(express.json({ limit: '50mb' }))
app.use(express.urlencoded({ extended: false }))

app.use('/v1/', lotteryRouter)

const PORT = 8000;

app.listen(PORT, () => {
    console.log(`Running on PORT ${PORT}`);
})