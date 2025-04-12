import { FastifyReply, FastifyRequest } from "fastify";

class OrganizationsController {
	async createOrganization(req: FastifyRequest, res: FastifyReply) {
		return req.body;
	}

	async getOrganization(req: FastifyRequest, res: FastifyReply) {
		return { hello: "world" };
	}
}

export default new OrganizationsController();
