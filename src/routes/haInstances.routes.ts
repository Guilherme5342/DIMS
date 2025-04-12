import { FastifyInstance, FastifyPluginOptions } from "fastify";
import { FastifyPluginAsyncZod } from "fastify-type-provider-zod";
import { z } from "zod";
import OrganizationsController from "../controllers/organizations.controller";
import { haInstanceId } from "../schemas/haInstances.schema";

const haInstancesRouter: FastifyPluginAsyncZod = async (fastify: FastifyInstance, options: FastifyPluginOptions) => {
	// fastify.post(
	//     "/",
	//     {
	//         schema: {
	//             tags: ["organizations"],
	//             description: "Criar uma nova organização",
	//             summary: "Criar uma nova organização",
	//             body:
	//         },
	//     },
	fastify.get(
		"/:id",
		{
			schema: {
				tags: ["ha_instances"],
				description: "Pegar uma instância HA por ID",
				summary: "Pegar uma instância HA por ID",
				params: z.object({ id: haInstanceId }),
			},
		},
		OrganizationsController.getOrganization
	);

	// fastify.get(
	// 	"/search",
	// 	{
	// 		schema: {
	// 			tags: ["organizations"],
	// 			description: "Pegar todas as organizações",
	// 			summary: "Pegar todas as organizações",
	// 		},
	// 	},
	// 	OrganizationsController.getAllOrganizations
	// );
};

export default haInstancesRouter;
