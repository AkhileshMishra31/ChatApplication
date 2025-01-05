import express, { Express } from "express";
import dotenv from "dotenv";
import routes from "./routes";  
import { errorHandler } from "./utils/errorHandler";
import "express-async-errors"
import logger from "./config/logger";
import { createServer } from "http";
// import { SocketInit } from "./sockets";
import "./redis/index"
import { SocketInit } from "./sockets";


dotenv.config();

const app: Express = express();
const PORT = process.env.PORT || 3000;

const httpServer = createServer(app);

app.use(express.json())

app.use("/api/v1", routes);

app.use(errorHandler)


SocketInit(httpServer)

httpServer.listen(PORT, () => {
    logger.info(`[server]: Server is running at http://localhost:${PORT}`);
});




