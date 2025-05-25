import { isBefore } from "date-fns";
import { createInsertSchema, createSelectSchema } from "drizzle-zod";
import z from "zod";
import { organizationsTable } from "../db/schema";
import { paginationSchema } from "./utils.schema";

export const organizationId = z
	.string({
		invalid_type_error: "ID deve ser uma string",
		required_error: "ID é obrigatório",
		description: "ID da organização",
	})
	.uuid({ message: "ID deve ser um UUID válido" });

export const orgIdParam = z.object({ id: organizationId });

export const organization = createSelectSchema(organizationsTable)
	.omit({ deletedAt: true })
	.strict()
	.describe("Organização");

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
		.transform((val) => val.trim()),
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
		.email({ message: "Email deve ser um email válido" })
		.transform((val) => val.trim()),
})
	.omit({
		id: true,
		bucketName: true,
		orgName: true,
		orgId: true,
		bucketId: true,
		createdAt: true,
		updatedAt: true,
		deletedAt: true,
	})
	.strict();

export const updateOrganization = newOrganization.partial().strict();

export const searchOrgParams = z
	.object({
		id: organizationId.optional(),
		name: z
			.string({
				invalid_type_error: "name deve ser uma string",
				description: "[Parcial] Nome da organização",
			})
			.optional(),
		email: z
			.string({
				invalid_type_error: "email deve ser uma string",
				description: "[Exato] Email da organização",
			})
			.optional(),
		description: z
			.string({
				invalid_type_error: "description deve ser uma string",
				description: "[Parcial] Descrição da organização",
			})
			.optional(),
		isActive: z
			.boolean({
				invalid_type_error: "isActive deve ser um booleano",
				description: "[Exato] Se o acesso da organização está ativo",
			})
			.optional(),
		createdAfter: z
			.string({
				invalid_type_error: "Data inicial deve ser uma string",
				description:
					"Data inicial do intervalo da data de criação, exemplo: '2023-10-01T00:00:00Z'",
			})
			.datetime({ offset: true })
			.optional(),
		createdBefore: z
			.string({
				invalid_type_error: "Data final deve ser uma string",
				description:
					"Data final do intervalo da data de criação, exemplo: '2023-10-01T00:00:00Z'",
			})
			.datetime({ offset: true })
			.optional(),
		updatedAfter: z
			.string({
				invalid_type_error: "Data inicial deve ser uma string",
				description:
					"Data inicial do intervalo da data de atualização, exemplo: '2023-10-01T00:00:00Z'",
			})
			.datetime({ offset: true })
			.optional(),
		updatedBefore: z
			.string({
				invalid_type_error: "Data final deve ser uma string",
				description:
					"Data final do intervalo da data de atualização, exemplo: '2023-10-01T00:00:00Z'",
			})
			.datetime({ offset: true })
			.optional(),
	})
	.extend(paginationSchema.shape)
	.strict()
	.refine(
		(d) =>
			(d.createdAfter && d.createdBefore) || (!d.createdAfter && !d.createdBefore),
		{
			message:
				"Se a data de criação for informada, deve-se informar o intervalo completo.",
		}
	)
	.refine(
		(d) =>
			(d.updatedAfter && d.updatedBefore) || (!d.updatedAfter && !d.updatedBefore),
		{
			message:
				"Se a data de atualização for informada, deve-se informar o intervalo completo.",
		}
	)
	.refine(
		(d) => {
			if (!d.createdAfter || !d.createdBefore) return true;
			return isBefore(d.createdAfter, d.createdBefore);
		},
		{
			message: "A data inicial deve ser anterior à data final",
		}
	)
	.refine(
		(d) => {
			if (!d.updatedAfter || !d.updatedBefore) return true;
			return isBefore(d.updatedAfter, d.updatedBefore);
		},
		{
			message: "A data inicial deve ser anterior à data final",
		}
	);
