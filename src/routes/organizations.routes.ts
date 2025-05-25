import { FastifyInstance } from "fastify";
import { FastifyPluginAsyncZod } from "fastify-type-provider-zod";
import { z } from "zod";
import { ORGANIZATIONS_TAG } from "../constants/swagger";
import OrganizationsController from "../controllers/organizations.controller";
import {
    defaultErrorSchema,
    postgresErrorSchema,
    zodErrorSchema,
} from "../schemas/errors.schema";
import {
    newOrganization,
    organization,
    orgIdParam,
    searchOrgParams,
    updateOrganization,
} from "../schemas/organizations.schemas";
import { paginatedResponseSchema } from "../schemas/utils.schema";

const organizationsRouter: FastifyPluginAsyncZod = async (fastify: FastifyInstance) => {
	fastify.post(
		"/",
		{
			schema: {
				tags: [ORGANIZATIONS_TAG],
				summary: "Criar uma nova organização",
				body: newOrganization,
				response: {
					201: organization,
					400: zodErrorSchema,
					500: postgresErrorSchema,
					501: defaultErrorSchema,
				},
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
				response: {
					200: organization,
					400: zodErrorSchema,
					500: postgresErrorSchema,
					501: defaultErrorSchema,
				},
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
				response: {
					200: organization,
					400: zodErrorSchema,
					500: postgresErrorSchema,
					501: defaultErrorSchema,
				},
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
				response: {
					200: z.object({}).describe("Organização deletada com sucesso"),
					400: zodErrorSchema,
					500: postgresErrorSchema,
					501: defaultErrorSchema,
				},
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
				querystring: searchOrgParams,
				response: {
					200: z
						.object({ items: z.array(organization) })
						.extend(paginatedResponseSchema.shape)
						.describe("Lista de organizações encontradas"),
					400: zodErrorSchema,
					500: postgresErrorSchema,
					501: defaultErrorSchema,
				},
			},
		},
		OrganizationsController.searchOrganizations
	);
};

export default organizationsRouter;
