import { FastifyInstance, FastifyPluginOptions } from "fastify";
import { FastifyPluginAsyncZod } from "fastify-type-provider-zod";
import { z } from "zod";
import OrganizationsController from "../controllers/organizations.controller";
import { newOrganization, organizationId } from "../schemas/organizations.schemas";

const organizationsRouter: FastifyPluginAsyncZod = async (fastify: FastifyInstance, options: FastifyPluginOptions) => {
	fastify.post(
		"/",
		{
			schema: {
				tags: ["organizations"],
				description: "Criar uma nova organização",
				summary: "Criar uma nova organização",
				body: newOrganization,
			},
		},
		OrganizationsController.createOrganization
	);
	fastify.get(
		"/:id",
		{
			schema: {
				tags: ["organizations"],
				description: "Pegar uma organização por ID",
				summary: "Pegar uma organização por ID",
				params: z.object({ id: organizationId }),
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

export default organizationsRouter;
