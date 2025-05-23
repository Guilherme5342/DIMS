import { isBefore } from "date-fns";
import { z } from "zod";

// Schema for date range
export const dateRangeSchema = z
	.object({
		after: z.string().datetime({ offset: true }),
		before: z.string().datetime({ offset: true }),
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
			coerce: true,
		}),
		max: z.number({
			required_error: "Valor máximo é obrigatório",
			invalid_type_error: "Valor máximo deve ser um número",
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
				coerce: true,
			})
			.min(1, { message: "O tamanho da página mínimo é 1" })
			.default(10),
		page: z
			.number({
				invalid_type_error: "O número da página deve ser um número",
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
	})
	.regex(/([0-9A-Fa-f]{2}[:-]){5}([0-9A-Fa-f]{2})/, {
		message: "Endereço MAC inválido",
	});
