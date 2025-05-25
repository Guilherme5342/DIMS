import dotenv from "dotenv-safe";
import { cleanEnv, port, str, url } from "envalid";
dotenv.config();

const ENV = cleanEnv(process.env, {
	NODE_ENV: str({ choices: ["development", "production", "staging"], default: "development" }),
	PORT: port({ desc: "Porta utilizada pelo servidor", example: "8080" }),
	ALLOWED_ORIGINS: str({ desc: "URLs autorizadas para CORS separadas por virgula", example: "https://example.com" }),
	POSTGRES_HOST: str({ desc: "Host do banco de dados PostgreSQL", example: "localhost" }),
    POSTGRES_PORT: port({ desc: "Porta do banco de dados PostgreSQL", example: "5432" }),
    POSTGRES_USER: str({ desc: "Usuário do banco de dados PostgreSQL", example: "postgres" }),
    POSTGRES_PASSWORD: str({ desc: "Senha do banco de dados PostgreSQL", example: "password" }),
    POSTGRES_SCHEMA: str({ desc: "Schema do banco de dados PostgreSQL", example: "public" }),
    INFLUXDB_HOST: str({ desc: "Host do InfluxDB", example: "localhost" }),
	INFLUXDB_PORT: port({ desc: "Porta do InfluxDB", example: "8086" }),
    INFLUXDB_TOKEN: str({ desc: "Token de autenticação do InfluxDB", example: "my-token" }),
});

export default ENV;
