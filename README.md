<h2 align="center"> 
	 Shopper - Atualização de Preços em Massa 🚀
</h2>

<p align="center">
 <a href="#-sobre-o-projeto">Sobre</a> •
 <a href="#-funcionalidades">Funcionalidades</a> •
 <a href="#-como-executar-o-projeto">Como executar</a> • 
 <a href="#-tecnologias">Tecnologias</a> • 
 <a href="#-autor">Autor</a>
</p>

## 💻 Sobre o projeto

Este repositório abriga um projeto full stack desenvolvido como parte de um desafio técnico proposto pela Bugaboo. O projeto, um gerenciador de arquivos GLB, utiliza uma abordagem abrangente, com o front-end construído em Next.js e o back-end em Nest.js.

## ⚙️ Funcionalidades

- [x] Upload de arquivo csv
- [x] Atualização de Preços

## 🚀 Como executar o projeto

### Pré-requisitos

Antes de começar, você vai precisar ter instalado em sua máquina as seguintes ferramentas:
[Git](https://git-scm.com), [Node.js](https://nodejs.org/en/) e um banco de dados [MYSQL](https://www.devmedia.com.br/primeiros-passos-no-mysql/28438) - Você pode usar uma ferramenta como o XAMPP para configurar e gerenciar facilmente um servidor MySQL local.
Além disto é bom ter um editor para trabalhar com o código como [VSCode](https://code.visualstudio.com/)

#### 🎲 Rodando o Backend (servidor)

```bash

# Clone este repositório
$ git clone git@github.com:kellygalliani/price-update.git

# Acesse a pasta do projeto no seu terminal/cmd
$ cd backend/

# Instale as dependências
$ npm install

# VÁ ATÉ O ARQUIVO "".env.example" e duplique o arquivo, modifique o nome para ".env" e insira dos dados do seu banco de dados mysql
$ DATABASE_URL="mysql://USER:PASSWORD@HOST:PORT/DATABASE?schema=public"

# Vá até seu software XAMPP
$ Clique em ativar o banco de dados MYSQL

# Execute a aplicação em modo de desenvolvimento
$ npm run start:dev

# A aplicação será aberta na porta:3000 - acesse http://localhost:3000

```

#### 🧭 Rodando o Frontend (client)

```bash

  Supondo que já tenha feito o clone.

# Acesse a pasta do projeto no seu terminal/cmd
$ cd frontend/

# Instale as dependências
$ npm install

# Execute a aplicação em modo de desenvolvimento
$ npm run dev

# A aplicação será aberta na porta:5173 - acesse http://localhost:5173/

```

## 🛠 Tecnologias

As seguintes ferramentas foram usadas na construção do projeto:

#### **Website** ([React](https://react.dev/) + [TypeScript](https://www.typescriptlang.org/))

- **[Tailwind](https://tailwindcss.com/docs/installation)**
- **[Axios](https://github.com/axios/axios)**

#### **Server** ([NestJs](https://nestjs.com/) + [TypeScript](https://www.typescriptlang.org/))

- **[dotENV](https://github.com/motdotla/dotenv)**
- **[Prisma](https://www.prisma.io/)**
- **[mySQL](https://www.postgresql.org/)**

## 🦸 Autor

<a href="https://github.com/kellygalliani">
 <img style="border-radius: 50%;" src="https://avatars.githubusercontent.com/u/110180304?v=4" width="100px;" alt=""/>
 <br />
 <sub><b>Kelly Cristina</b></sub></a> <a href="https://github.com/kellygalliani" title="Github">🚀</a>
 <br />

[![Linkedin Badge](https://img.shields.io/badge/-Kelly-blue?style=flat-square&logo=Linkedin&logoColor=white&link=https://www.linkedin.com/in/kelly-cristina-galliani/)](https://www.linkedin.com/in/kelly-cristina-galliani/)
[![Gmail Badge](https://img.shields.io/badge/-kelly_92b@hotmail.com-c14438?style=flat-square&logo=Gmail&logoColor=white&link=mailto:kelly_92b@hotmail.com)](mailto:kelly_92b@hotmail.com)

Feito com ❤️ por Kelly Cristina 👋🏽 [Entre em contato!](https://www.linkedin.com/in/kelly-cristina-galliani/)
