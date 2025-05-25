import { FastifyReply, FastifyRequest } from "fastify";
import createHttpError from "http-errors";
import {
    createHaInstance,
    getHaInstanceById,
    searchHaInstances,
    softDeleteHaInstance,
    updateHaInstance,
} from "../repositories/haInstances.repository";
import {
    GetHaInstanceParams,
    NewHaInstanceBody,
    SearchHaInstancesParams,
    UpdateHaInstanceBody,
} from "../types/haInstances.types";

class HaInstancesController {
	async createInstance(
		req: FastifyRequest<{ Body: NewHaInstanceBody }>,
		res: FastifyReply
	) {
		const [ha] = await createHaInstance(req.body);

		if (!ha) {
			throw createHttpError.InternalServerError(
				"Erro ao criar organização no banco"
			);
		}

		return res.status(201).send(ha);
	}

	async getInstance(
		req: FastifyRequest<{ Params: GetHaInstanceParams }>,
		res: FastifyReply
	) {
		const { id } = req.params;

		const [ha] = await getHaInstanceById(id);

		if (!ha) {
			throw createHttpError.NotFound("Instância não encontrada");
		}

		return res.send(ha);
	}

	async updateInstance(
		req: FastifyRequest<{ Params: GetHaInstanceParams; Body: UpdateHaInstanceBody }>,
		res: FastifyReply
	) {
		const { id } = req.params;

		const [ha] = await getHaInstanceById(id);

		if (!ha) {
			throw createHttpError.NotFound("Instância não encontrada");
		}

		const updatedHA = await updateHaInstance(id, req.body);

		if (!updatedHA) {
			throw createHttpError.InternalServerError(
				"Erro ao atualizar instância no banco"
			);
		}

		return res.send(updatedHA);
	}

	async deleteInstance(
		req: FastifyRequest<{ Params: GetHaInstanceParams }>,
		res: FastifyReply
	) {
		const { id } = req.params;

		const [ha] = await getHaInstanceById(id);

		if (!ha) {
			throw createHttpError.NotFound("Instância não encontrada");
		}

		const deletedHA = await softDeleteHaInstance(id);

		if (!deletedHA) {
			throw createHttpError.InternalServerError(
				"Erro ao deletar instância no banco"
			);
		}

		return res.send();
	}

	async searchInstances(
		req: FastifyRequest<{ Querystring: SearchHaInstancesParams }>,
		res: FastifyReply
	) {
		const params = req.query;

		const has = await searchHaInstances(params);

		return res.send(has);
	}
}

export default new HaInstancesController();
