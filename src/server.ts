import cors from "@fastify/cors";
import helmet from "@fastify/helmet";
import swagger from "@fastify/swagger";
import swaggerUi from "@fastify/swagger-ui";
import fastify from "fastify";
import { jsonSchemaTransform, serializerCompiler, validatorCompiler } from "fastify-type-provider-zod";
import ENV from "./env";
import organizationsRouter from "./routes/organizations.routes";

const app = fastify({
	logger: {
		level: ENV.isProd ? "info" : "debug",
	},
});

// Pre-route plugins
app.register(helmet);
app.register(cors, {
	origin: ENV.ALLOWED_ORIGINS.split(","),
	credentials: true,
});
app.setValidatorCompiler(validatorCompiler);
app.setSerializerCompiler(serializerCompiler);

// Swagger
app.register(swagger, {
	openapi: {
		info: {
			title: "DIMS API",
			description: "API do DIMS - Middleware uIoT",
			version: "1.0.0",
		},
		tags: [{ name: "organizations", description: "Operações relacionadas a organizações" }],
	},
	transform: jsonSchemaTransform,
});
app.register(swaggerUi, {
	routePrefix: "/docs",
	uiConfig: {
		docExpansion: "none",
	},
	theme: {
		title: "DIMS API",
	},
});

if (!ENV.isProd) {
	app.get("/", (_, res) => {
		res.send({ message: "API up and running", timestamp: new Date().toISOString });
	});
}

// Routers
app.register(organizationsRouter, { prefix: "/organizations" });

app.listen({ port: ENV.PORT }, (err, address) => {
	if (err) {
		app.log.error(err);
		process.exit(1);
	}
	app.log.info(`Server listening at ${address}`);
});
