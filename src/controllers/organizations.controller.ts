import { FastifyReply, FastifyRequest } from "fastify";
import createHttpError from "http-errors";
import { adminClient } from "../db/influxConnection";
import {
    checkOrgNameAndBucket,
    createOrganization,
    getOrganizationById,
    searchOrganizations,
    softDeleteOrganization,
    updateOrganization,
} from "../repositories/organizations.repository";
import {
    GetOrganizationParams,
    NewOrganizationBody,
    SearchOrgParams,
    UpdateOrganizationBody,
} from "../types/organizations.type";

class OrganizationsController {
	async createOrganization(
		req: FastifyRequest<{ Body: NewOrganizationBody }>,
		res: FastifyReply
	) {
		const orgName = req.body.name.toLocaleLowerCase().replace(/\s+/g, "-");
		const bucketName = `bucket-${orgName}`;

		// Check if the organization or bucket already exists
		const existingOrganization = await checkOrgNameAndBucket(orgName, bucketName);

		if (existingOrganization.length > 0) {
			throw createHttpError.Conflict("Organização com esse nome já existe");
		}

		//Create the organization and bucket in influxDB
		const org = await adminClient.orgs
			.postOrgs({
				body: {
					name: orgName,
					description: `Organização criada pelo sistema para a Organização [${req.body.name}]`,
				},
			})
			.catch((err) => {
				console.error("Erro ao criar organização no InfluxDB", err);
				throw createHttpError.InternalServerError(
					"Erro ao criar organização no InfluxDB"
				);
			});

		const bucket = await adminClient.buckets
			.postBuckets({
				body: {
					name: bucketName,
					description: `Bucket criado pelo sistema para a Organização [${req.body.name}]`,
					orgID: org.id!,
				},
			})
			.catch((err) => {
				console.error("Erro ao criar bucket no InfluxDB", err);
				throw createHttpError.InternalServerError(
					"Erro ao criar bucket no InfluxDB"
				);
			});

		const [organization] = await createOrganization({
			...req.body,
			createdAt: new Date(),
			updatedAt: new Date(),
			orgName,
			orgId: org.id!,
			bucketName,
			bucketId: bucket.id!,
		});

		if (!organization) {
			throw createHttpError.InternalServerError(
				"Erro ao criar organização no banco"
			);
		}

		return res.status(201).send(organization);
	}

	async getOrganization(
		req: FastifyRequest<{ Params: GetOrganizationParams }>,
		res: FastifyReply
	) {
		const { id } = req.params;

		const [organization] = await getOrganizationById(id);

		if (!organization || organization.deletedAt) {
			throw createHttpError.NotFound("Organização não encontrada");
		}

		return res.send(organization);
	}

	async updateOrganization(
		req: FastifyRequest<{
			Params: GetOrganizationParams;
			Body: UpdateOrganizationBody;
		}>,
		res: FastifyReply
	) {
		const { id } = req.params;

		const [organization] = await getOrganizationById(id);

		if (!organization || organization.deletedAt) {
			throw createHttpError.NotFound("Organização não encontrada");
		}

		let orgName = undefined;
		let bucketName = undefined;
		if (req.body.name && req.body.name !== organization.name) {
			orgName = req.body.name.toLocaleLowerCase().replace(/\s+/g, "-");
			bucketName = `bucket-${orgName}`;

			await adminClient.orgs
				.patchOrgsID({
					body: {
						name: orgName,
						description: `Organização criada pelo sistema para a Organização [${req.body.name}]`,
					},
					orgID: organization.orgId,
				})
				.catch((err) => {
					console.error("Erro ao atualizar organização no InfluxDB", err);
					throw createHttpError.InternalServerError(
						"Erro ao atualizar organização no InfluxDB"
					);
				});

			await adminClient.buckets
				.patchBucketsID({
					body: {
						name: bucketName,
						description: `Bucket criado pelo sistema para a Organização [${req.body.name}]`,
					},
					bucketID: organization.bucketId,
				})
				.catch((err) => {
					console.error("Erro ao atualizar organização no InfluxDB", err);
					throw createHttpError.InternalServerError(
						"Erro ao atualizar organização no InfluxDB"
					);
				});
		}

		const updatedOrganization = await updateOrganization(id, {
			...req.body,
			orgName: orgName || organization.orgName,
			bucketName: bucketName || organization.bucketName,
		});

		if (!updatedOrganization) {
			throw createHttpError.InternalServerError(
				"Erro ao atualizar organização no banco"
			);
		}

		return res.send(updatedOrganization);
	}

	async deleteOrganization(
		req: FastifyRequest<{ Params: GetOrganizationParams }>,
		res: FastifyReply
	) {
		const { id } = req.params;

		const [organization] = await getOrganizationById(id);

		if (!organization || organization.deletedAt) {
			throw createHttpError.NotFound("Organização não encontrada");
		}

		// Soft delete the organization in InfluxDB
		await adminClient.orgs
			.deleteOrgsID({
				orgID: organization.orgId,
			})
			.catch((err) => {
				console.error("Erro ao deletar organização no InfluxDB", err);
				throw createHttpError.InternalServerError(
					"Erro ao deletar organização no InfluxDB"
				);
			});

		const deletedOrganization = await softDeleteOrganization(id);

		if (!deletedOrganization) {
			throw createHttpError.InternalServerError(
				"Erro ao deletar organização no banco"
			);
		}

		return res.send();
	}

	async searchOrganizations(
		req: FastifyRequest<{ Querystring: SearchOrgParams }>,
		res: FastifyReply
	) {
		const params = req.query;

		const organizations = await searchOrganizations(params);

		return res.send(organizations);
	}
}

export default new OrganizationsController();
