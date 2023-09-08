import React, { useState } from "react";
import { useDropzone } from "react-dropzone";
import { api } from "../services/api";
import Papa from "papaparse";

interface Produto {
  product_code: string;
  new_price: string;
  erros?: any[];
}

interface ResultadoParse {
  data: Produto[];
  erros?: any[];
}

const FileUpload = () => {
  const [tableData, setTableData] = useState<[]>([]);
  const [tableHeaders, setTableHeaders] = useState<string[]>([]);
  const [responseType, setResponseType] = useState(0);
  const [typeError, setTypeError] = useState("");

  const { getRootProps, getInputProps } = useDropzone({
    onDrop: async (acceptedFiles) => {
      setTypeError("");
      const file = acceptedFiles[0];
      if (file.type !== "text/csv") {
        setTypeError("Apenas arquivos .CSV são aceitos");
        return;
      }

      const formData = new FormData();
      formData.append("file", file);
      try {
        const response = await api.patch("upload", formData, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        });

        const data = response.data;
        setResponseType(1);
        renderizarTabela(data);
        setTypeError("");
      } catch (error: any) {
        setTypeError("");
        console.error("Erro ao enviar o arquivo:", error);

        const parseResults = (await parseCSV(file)) as ResultadoParse;
        parseResults.erros = [];

        const apiErrors = error.response.data.errors;
        const errorsByProduct: { [productCode: string]: { erros: string[] } } =
          {};
        let erroNumber = 1;

        for (const apiError of apiErrors) {
          const produtosComErros = parseResults.data.filter(
            (item) => item.product_code === apiError.productCode
          );

          for (const product of produtosComErros) {
            const productCode = product.product_code;

            if (!errorsByProduct[productCode]) {
              errorsByProduct[productCode] = {
                erros: [],
              };
            }

            errorsByProduct[productCode].erros.push(
              `${erroNumber}. ${apiError.errorDescription}`
            );

            erroNumber++;
          }
        }

        for (const product of parseResults.data) {
          const productCode = product.product_code;
          if (errorsByProduct[productCode]) {
            product.erros = errorsByProduct[productCode].erros.map(
              (error: any) => <div>{error}</div>
            );
          }
        }

        parseResults.erros = parseResults.data.filter(
          (product) => product.erros
        );

        setResponseType(2);
        renderizarTabela(parseResults.erros);
      }
    },
  });

  const parseCSV = (file: any) => {
    return new Promise((resolve) => {
      Papa.parse(file, {
        header: true,
        dynamicTyping: true,
        complete: (results) => {
          resolve({ data: results.data });
        },
        error: (error) => {
          resolve({ error });
        },
      });
    });
  };

  const renderizarTabela = (data: any) => {
    if (data.length > 0) {
      const headers = Object.keys(data[0]);
      setTableHeaders(headers);
      setTableData(data);
    }
  };

  return (
    <div className="w-full flex flex-col gap-6">
      <div className="flex  flex-col items-center justify-center ">
        <div
          {...getRootProps()}
          className="flex flex-col max-w-md items-center justify-center w-full h-32 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-200/60"
        >
          <div className="flex flex-col items-center justify-center pt-5 pb-6">
            <svg
              className="w-8 h-8 mb-4 text-gray-500"
              aria-hidden="true"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 20 16"
            >
              <path
                stroke="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M13 13h3a3 3 0 0 0 0-6h-.025A5.56 5.56 0 0 0 16 6.5 5.5 5.5 0 0 0 5.207 5.021C5.137 5.017 5.071 5 5 5a4 4 0 0 0 0 8h2.167M10 15V6m0 0L8 8m2-2 2 2"
              />
            </svg>
            <p className="mb-2 text-sm text-gray-500">
              <span className="font-semibold">
                Clique para fazer o upload do arquivo CSV
              </span>{" "}
              ou arraste e solte
            </p>
            <p className="text-xs text-gray-500">.CSV (MAX. 1MB)</p>
          </div>
          <input {...getInputProps()} className="hidden" />
        </div>

        {typeError && (
          <div className="mt-4 text-red-500 font-semibold">{typeError}</div>
        )}
      </div>

      {responseType === 1 && (
        <div className="relative overflow-x-auto rounded-lg">
          <h2 className="text-lg font-semibold text-green-800 mb-7">
            ✅ Tabela de Preços atualizada com sucesso
          </h2>
          <table className="w-full text-sm text-left text-gray-600 ">
            <thead className="text-xs text-gray-800 uppercase bg-[#27a47d]">
              <tr>
                {tableHeaders.map((header, index) => (
                  <th key={index} scope="col" className="px-6 py-3">
                    {header}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {tableData.map((row, rowIndex) => (
                <tr
                  key={rowIndex}
                  className={`bg-${
                    rowIndex % 2 === 0 ? "white" : "[#edf0e8e1]"
                  } border-b text-left`}
                >
                  {tableHeaders.map((header, colIndex) => (
                    <td
                      key={colIndex}
                      className={`px-6 py-4 ${
                        colIndex === tableHeaders.length - 1 ? "text-right" : ""
                      }`}
                    >
                      {header === "Preço Atual" || header === "Novo Preço"
                        ? parseFloat(row[header]).toLocaleString("pt-BR", {
                            style: "currency",
                            currency: "BRL",
                          })
                        : row[header]}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
      {responseType === 2 && (
        <div className="relative overflow-x-auto rounded-lg">
          <h2 className="text-lg font-semibold text-red-500 mb-7">
            ⚠ Não foi possível atualizar a tabela
          </h2>
          <table className="w-full text-sm text-left text-gray-500">
            <thead className="text-xs text-gray-800 uppercase bg-[#ff5a3d]">
              <tr>
                {tableHeaders.map((header, index) => (
                  <th key={index} scope="col" className="px-6 py-3">
                    {header}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="border-2 rounded-sm">
              {tableData.map((row, rowIndex) => (
                <tr
                  key={rowIndex}
                  className={`bg-${
                    rowIndex % 2 === 0 ? "white" : "[#edf0e8e1]"
                  } border-b-2`}
                >
                  {tableHeaders.map((header, colIndex) => (
                    <td
                      key={colIndex}
                      className={`px-6 py-4 ${
                        colIndex === tableHeaders.length - 1 ? "text-right" : ""
                      }`}
                    >
                      {row[header]}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default FileUpload;
