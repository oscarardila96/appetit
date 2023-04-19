// import * as dotenv from "dotenv";
import "dotenv/config.js";
import express from "express";
import morgan from "morgan";
import cors from "cors";
import connection from './src/database/config.js';
import routerApi from "./src/routes/index.js";
import createSocketServer from './src/sockets/socket.js';
import http from 'http'
import swaggerDocs from "./swagger.js";

const app = express()
const server = http.createServer(app);

const port = process.env.PORT || 5000;

app.use(express.json())
app.use(express.urlencoded({ extended: true }));
app.use(morgan('dev'));
app.use(
    cors({
        origin: '*',
        exposedHeaders: '*',
        allowedHeaders: '*'
    })
    );
routerApi(app);

app.listen(port, () => {
    console.log(`Servidor corriendo en el puerto ${port}`);
    swaggerDocs(app, port);
});

createSocketServer(server);