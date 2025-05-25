import { FastifyError, FastifyReply, FastifyRequest } from "fastify";
import {
    hasZodFastifySchemaValidationErrors,
    isResponseSerializationError,
    ZodFastifySchemaValidationError,
} from "fastify-type-provider-zod";
import createHttpError from "http-errors";
import { PostgresError } from "postgres";

export default function errorHandler(
	err: FastifyError,
	req: FastifyRequest,
	reply: FastifyReply
) {
	if (hasZodFastifySchemaValidationErrors(err)) {
		return reply.code(400).send({
			error: "VALIDATION_ERROR",
			message: "Schema envidado não é válido",
			path: req.url,
			statusCode: 400,
			details: err.validation.map((v) => parseZodError(v)),
		});
	}

	if (isResponseSerializationError(err)) {
		return reply.code(500).send({
			error: "INTERNAL_SERVER_ERROR",
			message: "Erro ao serializar a resposta",
			path: req.url,
			statusCode: 500,
			details: err.cause.issues,
		});
	}

	if (err instanceof PostgresError) {
		return reply.code(501).send({
			error: "DB_ERROR",
			message: err.message,
			statusCode: 500,
			path: req.url,
			details: {
				pgCode: err.code,
				constraint: err.constraint_name,
				table: err.table_name,
			},
		});
	}

	if (createHttpError.isHttpError(err)) {
		// Split the name with _ before capital letters and capitalize
		const name = err.name
			.split(/(?=[A-Z])/)
			.join("_")
			.toUpperCase();

		return reply.code(err.statusCode).send({
			error: name,
			message: err.message,
			statusCode: err.statusCode,
			path: req.url,
		});
	}

	return reply.code(500).send({
		error: err.code,
		message: err.message,
		statusCode: err.statusCode,
		path: req.url,
	});
}

const parseZodError = (err: ZodFastifySchemaValidationError) => {
	return {
		field: err.params.issue.path.join("."),
		message: err.params.issue.message,
	};
};
