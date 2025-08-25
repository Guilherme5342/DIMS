# DIMS - Módulo de Ingestão e Gerenciamento de Dados uIoT

Este repositório contém o código-fonte do DIMS (Data Ingestion and Management System), um módulo do Middleware uIoT. O objetivo principal do DIMS é fornecer uma API robusta e escalável para a ingestão, armazenamento e consulta de dados provenientes de dispositivos IoT e outras fontes, utilizando PostgreSQL para dados relacionais e InfluxDB para séries temporais.

## Como rodar

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

## Estrutura dos arquivos e componentes do código

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
│   │   ├── influxConnection.ts   # Conexão com InfluxDB
│   │   ├── postgresConnection.ts # Conexão com PostgreSQL
│   │   ├── schema.ts             # Schemas do Drizzle ORM para PostgreSQL
│   │   └── migrations/           # Arquivos de migração do Drizzle ORM
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

## Como Contribuir

Leia o [guia de contribuição](./CONTRIBUTING.md) para entender como contribuir com o projeto.
