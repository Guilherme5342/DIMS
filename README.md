# DIMS - Módulo de Ingestão e Gerenciamento de Dados uIoT

## 1. Objetivo do Repositório

Este repositório contém o código-fonte do DIMS (Data Ingestion and Management System), um módulo do Middleware uIoT. O objetivo principal do DIMS é fornecer uma API robusta e escalável para a ingestão, armazenamento e consulta de dados provenientes de dispositivos IoT e outras fontes, utilizando PostgreSQL para dados relacionais e InfluxDB para séries temporais.

## 2. Estrutura dos arquivos e componentes do código

O projeto segue uma estrutura modular para facilitar a organização e manutenção do código:

```shell
.
├── docker-compose.yaml        # Define os serviços Docker (PostgreSQL, InfluxDB, API)
├── Dockerfile.api             # Define a imagem Docker para a API
├── drizzle.config.ts          # Configuração do Drizzle ORM para migrações de banco de dados
├── package.json               # Dependências e scripts do projeto Node.js
├── src/                       # Código-fonte da aplicação
│   ├── constants/             # Constantes da aplicação (ex: configurações do Swagger)
│   ├── controllers/           # Controladores (lógica de requisição/resposta HTTP)
│   ├── db/                    # Módulos de conexão e schemas de banco de dados
│   │   ├── influxConnection.ts  # Conexão com InfluxDB
│   │   ├── postgresConnection.ts# Conexão com PostgreSQL
│   │   ├── schema.ts            # Schemas do Drizzle ORM para PostgreSQL
│   │   └── migrations/          # Arquivos de migração do Drizzle ORM
│   ├── env.ts                 # Validação e carregamento de variáveis de ambiente
│   ├── middlewares/           # Middlewares da aplicação (ex: tratamento de erros)
│   ├── repositories/          # Lógica de acesso e manipulação de dados nos bancos
│   ├── routes/                # Definição das rotas da API
│   ├── schemas/               # Schemas Zod para validação de dados de entrada/saída
│   ├── server.ts              # Ponto de entrada da aplicação (configuração do Fastify)
│   └── types/                 # Definições de tipos TypeScript
└── README.md                  # Este arquivo
```

**Principais Componentes:**

* **API (Fastify):** Construída com [Fastify](https://www.fastify.io/), um framework web rápido e de baixo overhead para Node.js.
* **Banco de Dados Relacional (PostgreSQL + PostGIS):** Utilizado para armazenar dados estruturados e informações de entidades. A extensão PostGIS permite o armazenamento e consulta de dados geoespaciais.
* **Banco de Dados de Séries Temporais (InfluxDB):** Utilizado para armazenar medições e dados de sensores ao longo do tempo.
* **ORM (Drizzle ORM):** Usado para interagir com o PostgreSQL de forma type-safe e gerenciar migrações de banco de dados.
* **Validação (Zod):** Utilizado para validar schemas de dados nas requisições e facilitar gestão do swagger da aplicação.
* **Docker:** Para conteinerização e orquestração dos serviços da aplicação.

## 3. Como rodar

Para rodar a aplicação em ambiente de produção ou similar, siga os passos abaixo:

1. **Clone o repositório**

2. **Configurar `.env`:**

   A partir do `.env.example` crie um arquiv `.env` e preencha as variáveis de ambiente necessárias

   Edite o arquivo `.env` com os valores corretos para as variáveis de ambiente, como portas, credenciais de banco de dados, etc.

3. **Suba os containers Docker:**

   ```bash
   docker-compose up -d
   ```

   Este comando irá construir a imagem da API (se ainda não existir) e iniciar os containers do PostgreSQL, InfluxDB e da API em background (`-d`).

4. **Acessar a API:**

   A API estará disponível na porta configurada na variável `PORT` do seu arquivo `.env` (por exemplo, `http://localhost:8080`).

## 4. Como desenvolver

Para configurar o ambiente de desenvolvimento:

1. **Clone o repositório e configure o ambiente:**

   Siga os passos da seção "Como rodar" para clonar o repositóri, configurar o ambiente e subir os containers Docker.

2. **Instale as dependências do projeto:**

   É recomendado o uso do `pnpm` para gerenciamento de pacotes, mas `npm` também pode ser utilizados.

   ```bash
   # Usando pnpm (recomendado)
   pnpm install

   # Ou usando npm
   npm install
   ```

3. **Inicie os serviços de banco de dados (PostgreSQL e InfluxDB) via Docker:**
   Você pode usar o `docker-compose.yaml` para subir apenas os bancos, se preferir rodar a API localmente fora de um container.

   ```bash
   docker-compose up -d postgres influx
   ```

4. **Execute as migrações do banco de dados PostgreSQL:**
   O Drizzle Kit é utilizado para gerenciar as migrações.

   ```bash
   pnpm db:push # Ou npm run db:push
   ```

   Este comando aplicará as migrações pendentes ao seu banco de dados de desenvolvimento.

5. **Inicie a aplicação em modo de desenvolvimento:**

   ```bash
   pnpm dev # Ou npm run dev
   ```

   Este comando iniciará o servidor da API com `nodemon`, que reiniciará automaticamente o servidor ao detectar alterações nos arquivos do diretório `src/`.

6. **Scripts úteis do `package.json`:**
    * `dev`: Inicia o servidor em modo de desenvolvimento com watch.
    * `dev:no-watch`: Inicia o servidor em modo de desenvolvimento sem watch.
    * `build`: Compila o código TypeScript para JavaScript.
    * `start`: Inicia o servidor em modo de produção (requer build prévio).
    * `db:push`: Aplica as migrações do schema ao banco de dados.
    * `db:generate`: Gera arquivos de migração baseados nas alterações do schema.
    * `db:migrate`: Executa as migrações pendentes (alternativa ao `db:push` para cenários mais controlados).
    * `db:studio`: Abre o Drizzle Studio para visualizar e interagir com o banco de dados PostgreSQL.
    * `db:seed`: Executa o script de seeding do banco de dados (se configurado).

## 5. Guias das tecnologias utilizadas

Aqui estão alguns links úteis para as principais tecnologias utilizadas no projeto:

* **InfluxDB:**
  * **Consultando Dados com InfluxQL:** [InfluxDB v2 InfluxQL Documentation](https://docs.influxdata.com/influxdb/v2/query-data/influxql/)
  * **Melhores Práticas para Escrita de Dados - Resolvendo Alta Cardinalidade:** [InfluxDB v2 High Cardinality](https://docs.influxdata.com/influxdb/v2/write-data/best-practices/resolve-high-cardinality/)
  * **Melhores Práticas para Escrita de Dados - Design de Schema:** [InfluxDB v2 Schema Design](https://docs.influxdata.com/influxdb/v2/write-data/best-practices/schema-design/)
  * **Conceitos Chave - Elementos de Dados:** [InfluxDB v2 Data Elements](https://docs.influxdata.com/influxdb/v2/reference/key-concepts/data-elements/)
  * **Documentação Geral InfluxDB v2:** [InfluxDB v2 Documentation](https://docs.influxdata.com/influxdb/v2/)

* **PostgreSQL:**
  * **Documentação Oficial:** [PostgreSQL Documentation](https://www.postgresql.org/docs/)
  * **PostGIS (Extensão Geoespacial):** [PostGIS Documentation](https://postgis.net/documentation/)

* **Drizzle ORM:**
  * **Documentação Oficial:** [Drizzle ORM Documentation](https://orm.drizzle.team/docs)
  * **Drizzle Kit (CLI para Migrações):** [Drizzle Kit Documentation](https://orm.drizzle.team/kit-docs/overview)

* **Fastify:**
  * **Documentação Oficial:** [Fastify Documentation](https://www.fastify.io/docs/latest/)
  * **Plugins:**
    * `@fastify/cors`: [fastify-cors](https://github.com/fastify/fastify-cors)
    * `@fastify/helmet`: [fastify-helmet](https://github.com/fastify/fastify-helmet)
    * `@fastify/swagger`: [fastify-swagger](https://github.com/fastify/fastify-swagger)
    * `@fastify/swagger-ui`: [fastify-swagger-ui](https://github.com/fastify/fastify-swagger-ui)
    * `fastify-type-provider-zod`: [fastify-type-provider-zod](https://github.com/turkerdev/fastify-type-provider-zod)

* **Zod (Validação de Schema):**
  * **Documentação Oficial:** [Zod Documentation](https://zod.dev/)

* **Node.js:**
  * **Documentação Oficial:** [Node.js Documentation](https://nodejs.org/en/docs/)

* **Docker:**
  * **Documentação Oficial:** [Docker Documentation](https://docs.docker.com/)
  * **Docker Compose:** [Docker Compose Documentation](https://docs.docker.com/compose/)

* **TypeScript:**
  * **Documentação Oficial:** [TypeScript Documentation](https://www.typescriptlang.org/docs/)
