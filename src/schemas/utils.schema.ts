import { isBefore } from "date-fns";
import { z } from "zod";

// Schema for date range
export const dateRangeSchema = z
	.object({
		after: z
			.string({
				required_error: "Data inicial é obrigatória",
				invalid_type_error: "Data inicial deve ser uma string",
				description: "Data inicial do intervalo, exemplo: '2023-10-01T00:00:00Z'",
			})
			.datetime({ offset: true }),
		before: z
			.string({
				required_error: "Data final é obrigatória",
				invalid_type_error: "Data final deve ser uma string",
				description: "Data final do intervalo, exemplo: '2023-10-01T00:00:00Z'",
			})
			.datetime({ offset: true }),
	})
	.strict()
	.refine((range) => isBefore(range.before, range.after), {
		message: "A data inicial deve ser anterior à data final",
	});
// Schema for min and max values
export const minMaxSchema = z
	.object({
		min: z.number({
			required_error: "Valor mínimo é obrigatório",
			invalid_type_error: "Valor mínimo deve ser um número",
			description: "Valor mínimo do intervalo",
			coerce: true,
		}),
		max: z.number({
			required_error: "Valor máximo é obrigatório",
			invalid_type_error: "Valor máximo deve ser um número",
			description: "Valor máximo do intervalo",
			coerce: true,
		}),
	})
	.strict()
	.refine(({ min, max }) => min <= max, {
		message: "Valor mínimo deve ser menor ou igual ao valor máximo",
	});

// Schema for pagination
export const paginationSchema = z
	.object({
		size: z
			.number({
				invalid_type_error: "O tamanho da página deve ser um número",
				description: "Número de itens por página",
				coerce: true,
			})
			.min(1, { message: "O tamanho da página mínimo é 1" })
			.default(10),
		page: z
			.number({
				invalid_type_error: "O número da página deve ser um número",
				description: "Número da página",
				coerce: true,
			})
			.min(1, { message: "O número da página mínimo é 1" })
			.default(1),
	})
	.strict();

//MAC address schema
export const macAddressSchema = z
	.string({
		required_error: "Endereço MAC é obrigatório",
		invalid_type_error: "Endereço MAC deve ser uma string",
		description: "Endereço MAC do dispositivo, exemplo: '00:1A:2B:3C:4D:5E'",
	})
	.regex(/([0-9A-Fa-f]{2}[:-]){5}([0-9A-Fa-f]{2})/, {
		message: "Endereço MAC inválido",
	});
