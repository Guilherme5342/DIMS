import { FastifyInstance } from "fastify";
import { FastifyPluginAsyncZod } from "fastify-type-provider-zod";
import { ORGANIZATIONS_TAG } from "../constants/swagger";
import OrganizationsController from "../controllers/organizations.controller";
import {
    newOrganization,
    orgIdParam,
    searchOrgParams,
    updateOrganization,
} from "../schemas/organizations.schemas";

const organizationsRouter: FastifyPluginAsyncZod = async (fastify: FastifyInstance) => {
	fastify.post(
		"/",
		{
			schema: {
				tags: [ORGANIZATIONS_TAG],
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
				tags: [ORGANIZATIONS_TAG],
				summary: "Consultar uma organização por ID",
				params: orgIdParam,
			},
		},
		OrganizationsController.getOrganization
	);
	fastify.patch(
		"/:id",
		{
			schema: {
				tags: [ORGANIZATIONS_TAG],
				summary: "Atualizar uma organização por ID",
				params: orgIdParam,
				body: updateOrganization,
			},
		},
		OrganizationsController.updateOrganization
	);
	fastify.delete(
		"/:id",
		{
			schema: {
				tags: [ORGANIZATIONS_TAG],
				summary: "Deletar uma organização por ID",
				params: orgIdParam,
			},
		},
		OrganizationsController.deleteOrganization
	);
	fastify.get(
		"/search",
		{
			schema: {
				tags: [ORGANIZATIONS_TAG],
				summary: "Procurar organizações",
                querystring: searchOrgParams
			},
		},
		OrganizationsController.searchOrganizations
	);
};

export default organizationsRouter;
