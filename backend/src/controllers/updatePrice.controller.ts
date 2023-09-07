import { Request, Response } from "express";
import updatePriceService from "../services/updatePrice.service";

class UpdatePriceController {
  async get(req: Request, res: Response) {
    const products = await updatePriceService.get();
    return res.json(products);
  }
  async import(req: Request, res: Response) {
    const { file } = req;
    await updatePriceService.import(file!);
    return res.json({ message: "success" });
  }
}

const updatePriceController = new UpdatePriceController();

export default updatePriceController;
