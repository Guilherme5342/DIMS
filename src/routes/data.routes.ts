import { FastifyInstance } from "fastify";
import { FastifyPluginAsyncZod } from "fastify-type-provider-zod";
import { DATA_TAG } from "../constants/swagger";
import DataController from "../controllers/data.controller";

const dataRouter: FastifyPluginAsyncZod = async (fastify: FastifyInstance) => {
	fastify.post(
		"/",
		{
			schema: {
				tags: [DATA_TAG],
				summary: "Salvar a medição de um sensor",
			},
		},
		DataController.registerData
	);
};

export default dataRouter;
