import "express-async-errors";
import express from "express";

import { errorHandler } from "./middlewares/errors.middleware";
import updatePriceRoute from "./routes/updatePrice.routes";

const app = express();

app.use(express.json());
app.use("/update", updatePriceRoute);
app.use(errorHandler);

export default app;
