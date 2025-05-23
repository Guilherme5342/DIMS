import { createInsertSchema } from "drizzle-zod";
import z from "zod";
import { haInstancesTable } from "../db/schema";
import { organizationId } from "./organizations.schemas";
import { dateRangeSchema, macAddressSchema, paginationSchema } from "./utils.schema";

export const haInstanceId = z
	.string({
		invalid_type_error: "ID deve ser uma string",
		required_error: "ID é obrigatório",
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
				required_error: "name é obrigatório",
				description: "Nome da instância do Home Assistant",
			})
			.optional(),
		macAddress: macAddressSchema.optional(),
		isActive: z
			.boolean({
				invalid_type_error: "isActive deve ser um booleano",
				required_error: "isActive é obrigatório",
				description: "Se o acesso da instância está ativo",
			})
			.optional(),
		organizationId: organizationId.optional(),
		createdAtRange: dateRangeSchema.optional(),
		updatedAtRange: dateRangeSchema.optional(),
	})
	.extend(paginationSchema.shape)
	.strict();
