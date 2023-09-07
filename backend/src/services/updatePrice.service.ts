import fs from "node:fs";
import { parse } from "csv-parse";
import { iProductsPrice } from "../interfaces/updatePrice.interfaces";

import prisma from "../database/prisma.service";
import { z } from "zod";
import { AppError } from "../errors/app.error";

const csvSchema = z.object({
  product_code: z.string(),
  new_price: z.string(),
});

class UpdatePriceService {
  async get() {
    return await prisma.product.findMany();
  }

  private async loadProducts(
    file: Express.Multer.File
  ): Promise<iProductsPrice[]> {
    return new Promise(async (resolve, reject) => {
      const stream = fs.createReadStream(file.path);
      const products: iProductsPrice[] = [];

      const parseFile = parse();
      stream.pipe(parseFile);

      parseFile
        .on("data", async (line) => {
          try {
            line = {
              product_code: line[0],
              new_price: line[1].replace(";", ""),
            };
            products.push(line);
          } catch (error) {
            reject(error);
          }
        })
        .on("end", () => {
          fs.promises.unlink(file.path);
          delete products[0];
          resolve(products);
        });
      stream.on("error", (err) => {
        reject(`Erro durante o processamento do arquivo CSV: ${err.message}`);
      });
    });
  }

  async import(file: Express.Multer.File) {
    const products = await this.loadProducts(file);
    products.shift();

    for (const product of products) {
      const validatedLine = csvSchema.parse(product);
      console.log(validatedLine);
      const dbProduct = await prisma.product.findUnique({
        where: { code: parseFloat(validatedLine.product_code) },
      });
      console.log(dbProduct);
      if (!dbProduct) {
        throw new AppError(
          `Produto com código ${product.product_code} não encontrado`,
          400
        );
      }

      console.log(dbProduct);

      // Verificar se é um pacote
      const packs = await prisma.pack.findMany({
        where: { pack_id: dbProduct.code },
      });
      if (packs.length) {
        for (const pack of packs) {
          const updatedPack = products.find(
            (p) => p.product_code === pack.product_id
          );
          if (!updatedPack) {
            throw new AppError(
              `Preço do pacote ${pack.product_id} não foi enviado`,
              400
            );
          }
        }
      }
      /* if (pack) {
        // Verificar se o valor dos produtos avulsos foi enviado
        const packProducts = await prisma.pack.findMany({
          where: { pack_id: pack.id }
        });
        for (const packProduct of packProducts) {
          const updatedProduct = products.find(p => p.product_code === packProduct.product_code);
          if (!updatedProduct) {
            throw new Error(`Preço do produto avulso ${packProduct.product_code} não foi enviado`);
          }
        }
      } */

      // Verificar se o novo preço está abaixo do preço de custo
      if (product.new_price < dbProduct.costPrice) {
        throw new AppError(
          `Novo preço do produto ${product.product_code} está abaixo do preço de custo`,
          400
        );
      }

      // Verificar se o novo preço está até 10% acima ou abaixo do atual
      const minPrice = dbProduct.salesPrice * 0.9;
      const maxPrice = dbProduct.salesPrice * 1.1;
      if (product.new_price < minPrice || product.new_price > maxPrice) {
        throw new AppError(
          `Novo preço do produto ${product.product_code} está fora da faixa permitida`,
          400
        );
      }

      // Atualizar o preço do produto
      await prisma.product.update({
        where: { code: dbProduct.code },
        data: { salesPrice: product.new_price },
      });
    }
  }

  async export({}) {}
}
const updatePriceService = new UpdatePriceService();

export default updatePriceService;
