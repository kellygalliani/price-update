import React, { useState } from "react";
import { useDropzone } from "react-dropzone";
import { api } from "../services/api";
import Papa from "papaparse";

const FileUpload = () => {
  const [tableData, setTableData] = useState<[]>([]);
  const [tableHeaders, setTableHeaders] = useState([]);

  const [typeError, setTypeError] = useState("");

  const { getRootProps, getInputProps } = useDropzone({
    onDrop: async (acceptedFiles) => {
      setTypeError("");
      const file = acceptedFiles[0];
      if (file.type !== "text/csv") {
        setTypeError("Apenas arquivos .CSV são aceitos");
        return;
      }

      const parseResults = await parseCSV(file);
      parseResults.erros = [];

      /* if (
        parseResults.data.length === 0 ||
        !Object.prototype.hasOwnProperty.call(
          parseResults.data[0],
          "new_price"
        ) ||
        !Object.prototype.hasOwnProperty.call(
          parseResults.data[0],
          "product_code"
        )
      ) {
        renderizarTabela(parseResults.data);
        
        return;
      } */

      const formData = new FormData();
      formData.append("file", file);
      try {
        const response = await api.patch("upload", formData, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        });

        const data = response.data;

        renderizarTabela(data);
        setTypeError("");
      } catch (error) {
        setTypeError("");
        console.error("Erro ao enviar o arquivo:", error);
        /* renderizarTabela(parseResults.data); */
        const apiErrors = error.response.data.errors;
        for (const apiError of apiErrors) {
          // Encontre os produtos no arquivo CSV com base no productCode
          const produtosComErros = parseResults.data.filter(
            (item) => item.product_code === apiError.productCode
          );

          if (produtosComErros.length > 0) {
            // Mapeie os produtos com erros e suas mensagens de erro
            produtosComErros.forEach((product) => {
              if (!product.erros) {
                product.erros = [];
              }
              product.erros.push(apiError.errorDescription);
            });

            // Adicione os produtos com erros ao array erros em parseResults
            parseResults.erros.push(...produtosComErros);
          }
        }

        // Renderize o novo array com erros no renderizarTabela
        renderizarTabela(parseResults.erros);
      }
    },
  });

  const parseCSV = (file) => {
    return new Promise((resolve) => {
      Papa.parse(file, {
        header: true,
        dynamicTyping: true,
        complete: (results) => {
          resolve({ data: results.data }); // Removido o mapeamento com lineNumber
        },
        error: (error) => {
          resolve({ error });
        },
      });
    });
  };

  const renderizarTabela = (data) => {
    if (data.length > 0) {
      const headers = Object.keys(data[0]);
      setTableHeaders(headers);
      setTableData(data);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center w-full max-w-md m-b">
      <div
        {...getRootProps()}
        className="flex flex-col items-center justify-center w-full h-48 border-2 border-green-500 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-green-200/60"
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
          <p className="text-xs text-gray-500">CSV (MAX. 1MB)</p>
        </div>
        <input {...getInputProps()} className="hidden" />
      </div>

      {typeError && (
        <div className="mt-4 text-red-500 font-semibold">{typeError}</div>
      )}

      {tableData.length > 0 && (
        <div className="relative overflow-x-auto rounded-lg">
          <table className="w-full text-sm text-left text-gray-500">
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
                    rowIndex % 2 === 0 ? "white" : "[#edf0e8]"
                  } border-b`}
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

/* import { useDropzone } from "react-dropzone";

const FileUpload = () => {
  const { getRootProps, getInputProps } = useDropzone();

  return (
    <div className="flex items-center justify-center w-full max-w-sm">
      <div
        {...getRootProps()}
        className="flex flex-col items-center justify-center w-full h-40 border-2 border-green-500 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-green-200/60"
      >
        <div className="flex flex-col items-center justify-center pt-5 pb-6">
          <svg
            className="w-8 h-8 mb-4 text-gray-500 "
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
          <p className="mb-2 text-sm text-gray-500 ">
            <span className="font-semibold">Clique para fazer o upload</span> ou
            arraste e solte
          </p>
          <p className="text-xs text-gray-500 ">CSV (MAX. 1MB)</p>
        </div>
        <input {...getInputProps()} className="hidden" />
      </div>
    </div>
  );
};

export default FileUpload; */
