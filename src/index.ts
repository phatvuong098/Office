import http from 'http';
import express from 'express';
import { ServerSocket } from './socket';
import { connect, DI } from './config/database.config';
import { RequestContext } from '@mikro-orm/core';
import path from "path";
import { config } from "dotenv";
import { UpdateData } from './entities/UpdateData';

config({ path: path.join(__dirname, "../develop.env") });

const application = express();

/** Server Handling */
const httpServer = http.createServer(application);

/** Start Socket */
new ServerSocket(httpServer);

/** Log the request */
application.use((req, res, next) => {
    console.info(`METHOD: [${req.method}] - URL: [${req.url}] - IP: [${req.socket.remoteAddress}]`);

    res.on('finish', () => {
        console.info(`METHOD: [${req.method}] - URL: [${req.url}] - STATUS: [${res.statusCode}] - IP: [${req.socket.remoteAddress}]`);
    });

    next();
});

/** Parse the body of the request */
application.use(express.urlencoded({ extended: true }));
application.use(express.json());

// ** Mikro Orm */
// application.use((req, res, next) => RequestContext.create(DI.orm.em, next));

setInterval(GameLoop, 1000);

// ** Main Loop */
function GameLoop() {

    let sendData = [];
    for (let i = 0; i < 10; i++) {
        sendData.push(new UpdateData("User_" + i, (Math.round(Math.random() * 200 - 100) / 100), Math.round(Math.random() * 200 - 100) / 100, Math.round(Math.random() * 100) / 100))
    }

    ServerSocket.instance.io.emit("update", { syncDatas: sendData });
}

/** Rules of our API */
application.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');

    if (req.method == 'OPTIONS') {
        res.header('Access-Control-Allow-Methods', 'PUT, POST, PATCH, DELETE, GET');
        return res.status(200).json({});
    }

    next();
});

/** Healthcheck */
application.get('/ping', (req, res, next) => {
    return res.status(200).json({ hello: 'world!' });
});

/** Socket Information */
application.get('/status', (req, res, next) => {
    return res.status(200).json({ users: ServerSocket.instance.users });
});

/** Error handling */
application.use((req, res, next) => {
    const error = new Error('Not found');

    res.status(404).json({
        message: error.message
    });
});

// ** Mikro Orm */
// connect().then(async () => {
//     console.info(`*** Connected to Database! ***`);
// });

/** Listen */
httpServer.listen(1337, () => console.info(`Server is running`));