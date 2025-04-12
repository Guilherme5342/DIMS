import { createInsertSchema } from "drizzle-zod";
import z from "zod";
import { organizationsTable } from "../db/schema";

export const organizationId = z
	.string({
		invalid_type_error: "ID deve ser uma string",
		required_error: "ID é obrigatório",
		description: "ID da organização",
	})
	.uuid({ message: "ID deve ser um UUID válido" });

export const newOrganization = createInsertSchema(organizationsTable, {
	isActive: z.boolean({
		invalid_type_error: "isActive deve ser um booleano",
		description: "Se o acesso da organização está ativo",
	}),
	name: z
		.string({
			invalid_type_error: "name deve ser uma string",
			description: "Nome da organização",
		})
		.transform((val) => val.trim().toLocaleUpperCase()),
	description: z
		.string({
			invalid_type_error: "description deve ser uma string",
			description: "Descrição da organização",
		})
		.transform((val) => val.trim()),
	email: z
		.string({
			invalid_type_error: "email deve ser uma string",
			description: "Email da organização",
		})
		.email({ message: "Email deve ser um email válido" }),
})
	.omit({
		id: true,
		bucket: true,
		orgName: true,
		createdAt: true,
		updatedAt: true,
		deletedAt: true,
	})
	.strict();

export const updateOrganization = newOrganization.partial().strict();
