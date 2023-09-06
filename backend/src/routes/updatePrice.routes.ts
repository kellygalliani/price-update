import { Router } from "express";
import updatePriceController from "../controllers/updatePrice.controller";
import multerConfig from "../config/multer.config";
import multer from "multer";

const upload = multer(multerConfig);
const updatePriceRoute = Router();

updatePriceRoute.post("/import", upload.single("file"), (req, res) => {
  res.json("ok");
  /* updatePriceController.import(req, res); */
});

/* updatePriceRoute.get("/export", (req, res) =>
  updatePriceController.export(req, res)
); */

export default updatePriceRoute;
