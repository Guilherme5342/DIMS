import { FastifyReply, FastifyRequest } from "fastify";

class HaInstancesController {
	async getInstance(request: FastifyRequest, reply: FastifyReply) {
		return { hello: "instance" };
	}
}

export default new HaInstancesController();
