import { iProduct } from "../App";

interface TableProps {
  products: iProduct;
}

export default function Table({ products }: TableProps) {
  return (
    <div className="relative overflow-x-auto rounded-lg">
      <table className="w-full text-sm text-left text-gray-500">
        <thead className="text-xs text-gray-800 uppercase bg-[#27a47d]">
          <tr>
            {products.header.map((header, index) => (
              <th key={index} scope="col" className="px-6 py-3">
                {header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {products.content.map((product, rowIndex) => (
            <tr
              key={rowIndex}
              className={`bg-${
                rowIndex % 2 === 0 ? "white" : "[#edf0e8]"
              } border-b`}
            >
              {products.header.map((header, colIndex) => (
                <td
                  key={colIndex}
                  className={`px-6 py-4 ${
                    colIndex === products.header.length - 1 ? "text-right" : ""
                  }`}
                >
                  {product[header]}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
