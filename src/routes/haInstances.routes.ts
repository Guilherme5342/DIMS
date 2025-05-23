import { FastifyInstance } from "fastify";
import { FastifyPluginAsyncZod } from "fastify-type-provider-zod";
import { HA_INSTANCE_TAG } from "../constants/swagger";
import HaInstancesController from "../controllers/homeAssistants.controller";
import {
    haInstanceIdParam,
    newHaInstance,
    searchHaInstancesParams,
    updateHaInstance,
} from "../schemas/haInstances.schema";

const haInstancesRouter: FastifyPluginAsyncZod = async (fastify: FastifyInstance) => {
	fastify.post(
		"/",
		{
			schema: {
				tags: [HA_INSTANCE_TAG],
				summary: "Cadastro de uma nova instância do Home Assistant",
				body: newHaInstance,
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
			},
		},
		HaInstancesController.searchInstances
	);
};

export default haInstancesRouter;
