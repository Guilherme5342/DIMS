import { FastifyReply, FastifyRequest } from "fastify";
import { z } from "zod";
import { createOrganization } from "../repositories/organizations.repository";
import { newOrganization } from "../schemas/organizations.schemas";

class OrganizationsController {
	async createOrganization(
		req: FastifyRequest<{ Body: z.infer<typeof newOrganization> }>,
		res: FastifyReply
	) {
		const orgName = req.body.name.trim().toLocaleLowerCase().replace(/\s+/g, "-");
		const bucketName = `bucket-${orgName}`;

		const [organization] = await createOrganization({
			...req.body,
			createdAt: new Date(),
			updatedAt: new Date(),
			orgName,
			bucketName,
		});

		return res.status(201).send(organization);
	}

	async getOrganization(req: FastifyRequest, res: FastifyReply) {
		return { hello: "world" };
	}
}

export default new OrganizationsController();
