import { resolve } from "node:path";
import multer, { FileFilterCallback } from "multer";
import { Request } from "express";

const tempFolder = resolve(__dirname, "..", "..", "tmp");

const fileSize = 1 * 1024 * 1024;

export default {
  tempFolder,

  fileFilter: (
    request: Request,
    file: Express.Multer.File,
    callback: FileFilterCallback
  ) => {
    const acceptedTypes = file.mimetype;
    if (acceptedTypes === "text/csv") {
      callback(null, true);
    } else {
      callback(null, false);
      callback(new Error("Only csv format allowed"));
    }
  },
  limits: {
    fileSize,
  },
  storage: multer.diskStorage({
    destination: tempFolder,
    filename: (_, file, callback) => {
      const filename = `${file.originalname}.csv`;

      return callback(null, filename);
    },
  }),
};
