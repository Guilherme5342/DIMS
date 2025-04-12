import dotenv from "dotenv-safe";
import { cleanEnv, port, str, url } from "envalid";
dotenv.config();

const ENV = cleanEnv(process.env, {
	NODE_ENV: str({ choices: ["development", "production", "staging"], default: "development" }),
	PORT: port({ desc: "Porta utilizada pelo servidor", example: "8080" }),
	ALLOWED_ORIGINS: str({ desc: "URLs autorizadas para CORS separadas por virgula", example: "https://example.com" }),
	POSTGRES_URL: url({ desc: "URL do banco de dados Postgres", example: "postgres://user:password@localhost:5432/dbname" }),
	INFLUX_URL: url({ desc: "URL do banco de dados InfluxDB", example: "http://localhost:8086" }),
	INFLUX_TOKEN: str({ desc: "Token de autenticação do InfluxDB", example: "my-token" }),
});

export default ENV;
