import express, { Express } from "express";
import dotenv from "dotenv";
import routes from "./routes";  // Import all routes
import { errorHandler } from "./utils/errorHandler";


dotenv.config();

const app: Express = express();
const PORT = process.env.PORT || 3000;

app.use(express.json())

app.use(routes);

app.use(errorHandler)

app.listen(PORT, () => {
    console.log(`[server]: Server is running at http://localhost:${PORT}`);
});