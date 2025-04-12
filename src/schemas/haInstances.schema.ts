import z from "zod";

export const haInstanceId = z
	.string({ invalid_type_error: "ID deve ser uma string", required_error: "ID é obrigatório" })
	.uuid({ message: "ID deve ser um UUID válido" });
