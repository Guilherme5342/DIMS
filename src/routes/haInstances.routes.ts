import { FastifyInstance } from "fastify";
import { FastifyPluginAsyncZod } from "fastify-type-provider-zod";
import { z } from "zod";
import { HA_INSTANCE_TAG } from "../constants/swagger";
import OrganizationsController from "../controllers/organizations.controller";
import { haInstanceId } from "../schemas/haInstances.schema";

const haInstancesRouter: FastifyPluginAsyncZod = async (fastify: FastifyInstance) => {
	fastify.get(
		"/:id",
		{
			schema: {
				tags: [HA_INSTANCE_TAG],
				description: "Pegar uma instância HA por ID",
				summary: "Pegar uma instância HA por ID",
				params: z.object({ id: haInstanceId }),
			},
		},
		OrganizationsController.getOrganization
	);
};

export default haInstancesRouter;
