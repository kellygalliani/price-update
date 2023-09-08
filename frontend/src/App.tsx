import FileUpload from "./components/FileUpload";

/* const user = {
  name: "Joana",
  email: "joana@shopper.com",
  imageUrl:
    "https://ibb.co/zVwLYX3",
}; */

export default function App() {
  return (
    <>
      <div className="min-h-full">
        <header className="bg-[#1E2044] shadow">
          <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
            <img
              src="https://landing.shopper.com.br/static/media/logo-original.c7089ad32bcf61645d35.webp"
              alt="logo"
              className="w-24"
            />
          </div>
        </header>
        <main>
          <div className="mx-auto max-w-7xl py-6 sm:px-6 lg:px-8">
            <div className="px-4 sm:px-0 flex  justify-between">
              <div>
                <h3 className="text-3xl font-semibold leading-7 text-gray-900">
                  Atualizar de Preços em Massa
                </h3>
                <p className="mt-1 max-w-2xl text-sm leading-6 text-gray-500">
                  Envie seu arquivo csv e faça a atualização do preço de seus
                  produtos
                </p>
              </div>
              <a
                href="/atualizacao_preco_example.csv"
                download="modelo_preco_example.csv"
                className="mt-4 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-[#27a47d] hover:bg-[#1e8f68] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#27a47d]"
              >
                Baixar Modelo de Planilha
              </a>
            </div>
            <div className="mt-6 border-t border-gray-100">
              <FileUpload />
            </div>
          </div>
        </main>
      </div>
    </>
  );
}
