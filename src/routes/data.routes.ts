import { FastifyInstance } from "fastify";
import { FastifyPluginAsyncZod } from "fastify-type-provider-zod";
import { z } from "zod";
import { DATA_TAG } from "../constants/swagger";
import DataController from "../controllers/data.controller";
import { data, deleteData, newData, searchData } from "../schemas/data.schema";
import {
    defaultErrorSchema,
    postgresErrorSchema,
    zodErrorSchema,
} from "../schemas/errors.schema";

const dataRouter: FastifyPluginAsyncZod = async (fastify: FastifyInstance) => {
	fastify.post(
		"/",
		{
			schema: {
				tags: [DATA_TAG],
				summary: "Salvar a medição de um sensor",
				body: newData,
				response: {
					200: data,
					400: zodErrorSchema,
					500: postgresErrorSchema,
					501: defaultErrorSchema,
				},
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
				response: {
					200: z.object({}).describe("Dados excluídos com sucesso"),
					400: zodErrorSchema,
					500: postgresErrorSchema,
					501: defaultErrorSchema,
				},
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
				response: {
					200: z.array(data).describe("Lista de dados encontrados"),
					400: zodErrorSchema,
					500: postgresErrorSchema,
					501: defaultErrorSchema,
				},
			},
		},
		DataController.searchData
	);
};

export default dataRouter;
