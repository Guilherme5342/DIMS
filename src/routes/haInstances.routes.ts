import { FastifyInstance } from "fastify";
import { FastifyPluginAsyncZod } from "fastify-type-provider-zod";
import { z } from "zod";
import { HA_INSTANCE_TAG } from "../constants/swagger";
import HaInstancesController from "../controllers/homeAssistants.controller";
import {
    defaultErrorSchema,
    postgresErrorSchema,
    zodErrorSchema,
} from "../schemas/errors.schema";
import {
    haInstance,
    haInstanceIdParam,
    newHaInstance,
    searchHaInstancesParams,
    updateHaInstance,
} from "../schemas/haInstances.schema";
import { paginatedResponseSchema } from "../schemas/utils.schema";

const haInstancesRouter: FastifyPluginAsyncZod = async (fastify: FastifyInstance) => {
	fastify.post(
		"/",
		{
			schema: {
				tags: [HA_INSTANCE_TAG],
				summary: "Cadastro de uma nova instância do Home Assistant",
				body: newHaInstance,
				response: {
					200: haInstance,
					400: zodErrorSchema,
					500: postgresErrorSchema,
					501: defaultErrorSchema,
				},
			},
		},
		HaInstancesController.createInstance
	);
	fastify.get(
		"/:id",
		{
			schema: {
				tags: [HA_INSTANCE_TAG],
				summary: "Consultar uma instância do Home Assistant por ID",
				params: haInstanceIdParam,
				response: {
					200: haInstance,
					400: zodErrorSchema,
					500: postgresErrorSchema,
					501: defaultErrorSchema,
				},
			},
		},
		HaInstancesController.getInstance
	);
	fastify.patch(
		"/:id",
		{
			schema: {
				tags: [HA_INSTANCE_TAG],
				summary: "Atualizar uma instância do Home Assistant por ID",
				params: haInstanceIdParam,
				body: updateHaInstance,
				response: {
					200: haInstance,
					400: zodErrorSchema,
					500: postgresErrorSchema,
					501: defaultErrorSchema,
				},
			},
		},
		HaInstancesController.updateInstance
	);
	fastify.delete(
		"/:id",
		{
			schema: {
				tags: [HA_INSTANCE_TAG],
				summary: "Deletar uma instância do Home Assistant por ID",
				params: haInstanceIdParam,
				response: {
					200: z.object({}).describe("Instância deletada com sucesso"),
					400: zodErrorSchema,
					500: postgresErrorSchema,
					501: defaultErrorSchema,
				},
			},
		},
		HaInstancesController.deleteInstance
	);
	fastify.get(
		"/search",
		{
			schema: {
				tags: [HA_INSTANCE_TAG],
				summary: "Consultar uma ou mais instâncias do Home Assistant",
				querystring: searchHaInstancesParams,
				response: {
					200: z
						.object({ items: z.array(haInstance) })
						.extend(paginatedResponseSchema.shape)
						.describe("Lista de instâncias do Home Assistant"),
					400: zodErrorSchema,
					500: postgresErrorSchema,
					501: defaultErrorSchema,
				},
			},
		},
		HaInstancesController.searchInstances
	);
};

export default haInstancesRouter;
