import { isBefore } from "date-fns";
import { createInsertSchema } from "drizzle-zod";
import z from "zod";
import { haInstancesTable } from "../db/schema";
import { organizationId } from "./organizations.schemas";
import { macAddressSchema, paginationSchema } from "./utils.schema";

export const haInstanceId = z
	.string({
		invalid_type_error: "ID deve ser uma string",
		required_error: "ID é obrigatório",
		description: "ID da instância do Home Assistant",
	})
	.uuid({ message: "ID deve ser um UUID válido" });
export const haInstanceIdParam = z.object({
	id: haInstanceId,
});
export const newHaInstance = createInsertSchema(haInstancesTable, {
	name: z
		.string({
			invalid_type_error: "name deve ser uma string",
			required_error: "name é obrigatório",
			description: "Nome da instância do Home Assistant",
		})
		.transform((val) => val.trim()),
	isActive: z.boolean({
		invalid_type_error: "isActive deve ser um booleano",
		required_error: "isActive é obrigatório",
		description: "Se o acesso da instância está ativo",
	}),
	macAddress: macAddressSchema,
	organizationId: organizationId,
})
	.omit({
		id: true,
		createdAt: true,
		updatedAt: true,
		deletedAt: true,
	})
	.strict();

export const updateHaInstance = newHaInstance.partial();

export const searchHaInstancesParams = z
	.object({
		id: haInstanceId.optional(),
		name: z
			.string({
				invalid_type_error: "name deve ser uma string",
				description: "[Parcial] Nome da instância do Home Assistant",
			})
			.optional(),
		macAddress: macAddressSchema.optional(),
		isActive: z
			.boolean({
				invalid_type_error: "isActive deve ser um booleano",
				description: "Se o acesso da instância está ativo",
			})
			.optional(),
		organizationId: organizationId.optional(),
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
