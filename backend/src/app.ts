import "express-async-errors";
import express from "express";
import cors from "cors";
import updatePriceRoute from "./routes/updatePrice.routes";
import { errorHandler } from "./middlewares/errors.middleware";

const app = express();

app.use(cors());
app.use(express.json());
app.use("/", updatePriceRoute);
app.use(errorHandler);

export default app;
