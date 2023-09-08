import { BadRequestException, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/database/prisma.service';
import { parse as csvParse } from 'csv-parse';

export interface iProductsPrice {
  product_code: number;
  new_price: number;
}

@Injectable()
export class UpdatepriceService {
  constructor(private prisma: PrismaService) {}

  async findAll() {
    return this.prisma.product.findMany();
  }

  private loadProducts(file: Express.Multer.File): Promise<iProductsPrice[]> {
    return new Promise((resolve, reject) => {
      // eslint-disable-next-line @typescript-eslint/no-var-requires
      const fs = require('fs');
      const stream = fs.createReadStream(file.path);
      const products: iProductsPrice[] = [];
      let lineCount = 0;

      const parseFile = csvParse();
      stream.pipe(parseFile);

      parseFile
        .on('data', async (line) => {
          lineCount++;
          let [product_code, new_price] = line;

          if (new_price.includes(';')) {
            new_price = new_price.replace(';', '');
          }

          new_price = parseFloat(new_price);
          product_code = parseInt(product_code);

          products.push({
            product_code,
            new_price,
          });
        })
        .on('end', () => {
          fs.promises.unlink(file.path);
          delete products[0];
          resolve(products);
        })
        .on('error', (err) => {
          reject(
            new BadRequestException(
              `The file is incomplete. Error occurred on line ${lineCount}`,
            ),
          );
        });
    });
  }

  async update(file: Express.Multer.File) {
    const products = await this.loadProducts(file);
    products.shift();

    const errors = [];

    const updatedProducts = [];

    for (const product of products) {
      const dbProduct = await this.prisma.product.findUnique({
        where: { code: product.product_code },
      });

      if (!dbProduct) {
        errors.push({
          productCode: product.product_code,
          errorDescription: `Produto com código ${product.product_code} não encontrado`,
        });
      }

      if (isNaN(product.new_price)) {
        errors.push({
          productCode: product.product_code,
          errorDescription: `Valor de preço inválido para o produto ${product.product_code}`,
        });
      }

      const packs = await this.prisma.pack.findMany({
        where: {
          OR: [{ pack_id: dbProduct.code }, { product_id: dbProduct.code }],
        },
      });

      if (packs.length > 0) {
        const isPack = packs.some((pack) => pack.pack_id === dbProduct.code);
        const isPackProduct = packs.some(
          (pack) => pack.product_id === dbProduct.code,
        );

        if (isPack) {
          for (const pack of packs) {
            const updatedPack = products.find(
              (p) => p.product_code === pack.product_id,
            );

            if (!updatedPack) {
              errors.push({
                productCode: dbProduct.code,
                errorDescription: `Este produto é um pacote - preço do produto avulso '${pack.product_id}' está ausente `,
              });
            }
          }
        }
        if (isPackProduct) {
          for (const pack of packs) {
            const updatedPack = products.find(
              (p) => p.product_code === pack.pack_id,
            );

            if (!updatedPack) {
              errors.push({
                productCode: pack.product_id,
                errorDescription: `Este produto faz parte do pacote ${pack.pack_id}. O preço do pacote deve ser fornecido.`,
              });
            }
          }
        }
      }

      if (Number(product.new_price) < Number(dbProduct.costPrice)) {
        errors.push({
          productCode: product.product_code,
          errorDescription: `O novo preço do produto ${product.product_code} está abaixo do preço de custo`,
        });
      }

      const priceDifference =
        ((product.new_price - dbProduct.salesPrice) / dbProduct.salesPrice) *
        100;

      if (priceDifference < -10 || priceDifference > 10) {
        errors.push({
          productCode: product.product_code,
          errorDescription: `O novo preço do produto ${
            product.product_code
          } está ${Math.abs(priceDifference).toFixed(2)}% ${
            priceDifference < -10 ? 'abaixo' : 'acima'
          } do preço atual`,
        });
      }

      if (errors.length > 0) {
        continue;
      }

      const updatedProduct = await this.prisma.product.update({
        where: { code: dbProduct.code },
        data: { salesPrice: product.new_price },
      });
      const nomeComCaracteresCorretos = decodeURIComponent(
        encodeURI(updatedProduct.name),
      );
      updatedProducts.push({
        Código: updatedProduct.code,
        Nome: nomeComCaracteresCorretos,
        'Preço Atual': dbProduct.salesPrice,
        'Novo Preço': product.new_price,
      });
    }
    console.log(errors.length);

    if (errors.length > 0) {
      throw new BadRequestException({ errors });
    }
    return updatedProducts;
  }
}
