/* import { useState } from "react"; */
/* import { PaperClipIcon } from "@heroicons/react/20/solid"; */
import { useEffect, useState } from "react";
import { api } from "./services/api";
import Table from "./components/Table";
import Modal from "./components/Modal";
import FileUpload from "./components/FileUpload";

/* const user = {
  name: "Joana",
  email: "joana@shopper.com",
  imageUrl:
    "https://ibb.co/zVwLYX3",
}; */

export interface iProduct {
  header: string[];
  content: string[];
}

export default function App() {
  const [showModal, setShowModal] = useState(false);
  const [products, setProducts] = useState<iProduct>({
    header: [],
    content: [],
  });

  const openModal = (): void => {
    setShowModal(true);
  };

  const closeModal = (): void => {
    setShowModal(false);
  };

  useEffect(() => {
    (async () => {
      const response = await api.get("/");
      const data = response.data;
      if (data.length > 0) {
        const header = Object.keys(data[0]);

        const productsFormatted = data.map(
          (product: { costPrice: number; salesPrice: number }) => ({
            ...product,
            salesPrice: product.salesPrice.toLocaleString("pt-BR", {
              style: "currency",
              currency: "BRL",
            }),
            costPrice: product.costPrice.toLocaleString("pt-BR", {
              style: "currency",
              currency: "BRL",
            }),
          })
        );

        setProducts({
          header,
          content: productsFormatted,
        });
      }
    })();
  }, []);

  return (
    <>
      <div className="min-h-full">
        <header className="bg-white shadow">
          <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
            <h1 className="text-3xl font-bold tracking-tight text-[#151A33]">
              Atualizar Preços
            </h1>
          </div>
        </header>
        <main>
          <div className="mx-auto max-w-7xl py-6 sm:px-6 lg:px-8">
            <div>
              <div className="px-4 sm:px-0">
                <h3 className="text-base font-semibold leading-7 text-gray-900">
                  Informação de Produtos
                </h3>
                <p className="mt-1 max-w-2xl text-sm leading-6 text-gray-500">
                  Lista de Todos os produtos com seus respectivos preços
                </p>
                {/* <button
                  className="block text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
                  type="button"
                  onClick={openModal}
                >
                  Toggle modal
                </button> */}
              </div>
              <div className="mt-6 border-t flex justify-center border-gray-100">
                {/* <Table products={products} /> */}
                <FileUpload />
              </div>
            </div>
          </div>
        </main>
      </div>
      <Modal showModal={showModal} closeModal={closeModal} />
    </>
  );
}
