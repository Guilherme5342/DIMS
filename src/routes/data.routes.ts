import { FastifyInstance } from "fastify";
import { FastifyPluginAsyncZod } from "fastify-type-provider-zod";
import { DATA_TAG } from "../constants/swagger";
import DataController from "../controllers/data.controller";
import { deleteData, newData, searchData } from "../schemas/data.schema";

const dataRouter: FastifyPluginAsyncZod = async (fastify: FastifyInstance) => {
	fastify.post(
		"/",
		{
			schema: {
				tags: [DATA_TAG],
				summary: "Salvar a medição de um sensor",
				body: newData,
			},
		},
		DataController.registerData
	);
	fastify.delete(
		"/",
		{
			schema: {
				tags: [DATA_TAG],
				summary: "Deletar dados de sensores",
				description:
					"Deletar dados de sensores. Para deletar dados, é necessário informar o nome do sensor ou a tag do sensor para identificar os dados a serem excluídos. Além disso, é necessário informar o intervalo de datas para deletar os dados.",
				body: deleteData,
			},
		},
		DataController.deleteData
	);
	fastify.get(
		"/search",
		{
			schema: {
				tags: [DATA_TAG],
				summary: "Buscar dados de sensores",
				querystring: searchData,
			},
		},
		DataController.searchData
	);
};

export default dataRouter;
