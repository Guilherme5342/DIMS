import { isBefore } from "date-fns";
import { z } from "zod";
import { organizationId } from "./organizations.schemas";
import { dateRangeSchema, queryArray } from "./utils.schema";

export const data = z
	.object({
		sensorName: z.string(),
		value: z.string(),
		date: z.string(),
		unit: z.string(),
		tag: z.string(),
		raw: z.any(),
	})
	.strict()
	.describe("Leitura do sensor");

export const newData = z
	.object({
		raw: z
			.any({
				invalid_type_error: "Dados brutos devem ser um objeto",
				description: "Dados brutos do sensor",
			})
			.optional(),
		sensorName: z.string({
			invalid_type_error: "Nome do sensor deve ser uma string",
			description: "Nome do sensor, utilizado para identificar o ponto no InfluxDB",
		}),
		value: z.coerce.string({
			description: "Valor da medição do sensor",
		}),
		unit: z.string({
			invalid_type_error: "Unidade deve ser uma string",
			description: "Unidade da medição do sensor, exemplo: '°C', 'm/s', 'kg/m²'",
		}),
		tag: z
			.string({
				invalid_type_error: "Tag deve ser uma string",
				description: "Tag do sensor, exemplo: 'sensor_sala', 'sensor_jardim'",
			})
			.optional(),
		date: z
			.string({
				invalid_type_error: "Data deve ser uma string",
				description: "Data da medição do sensor, exemplo: '2023-10-01T00:00:00Z'",
			})
			.datetime({ offset: true, message: "Data deve ser uma data válida" }),
		orgId: organizationId,
	})
	.strict();

export const deleteData = z
	.object({
		sensorName: z
			.string({
				invalid_type_error: "Nome do sensor deve ser uma string",
				description:
					"Nome do sensor, utilizado para identificar o ponto no InfluxDB",
			})
			.optional(),
		tag: z
			.string({
				invalid_type_error: "Tag deve ser uma string",
				description: "Tag do sensor, exemplo: 'sensor_sala', 'sensor_jardim'",
			})
			.optional(),
		deleteRange: dateRangeSchema,
		orgId: organizationId,
	})
	.strict()
	.refine((data) => data.sensorName || data.tag, {
		message:
			"Pelo menos um dos campos 'sensorName' ou 'tag' deve ser fornecido para identificar os dados a serem excluídos.",
	});

export const searchData = z
	.object({
		orgId: organizationId,
		sensorName: queryArray(
			z.string({ invalid_type_error: "Nome do sensor deve ser uma string" }),
			{ description: "Filtrar por nome do sensor" }
		).optional(),
		tags: queryArray(z.string({ invalid_type_error: "Tag deve ser uma string" }), {
			description: "Filtrar tags especificas",
		}).optional(),
		startAfter: z
			.string({
				required_error: "Data inicial é obrigatória",
				invalid_type_error: "Data inicial deve ser uma string",
				description: "Data inicial do intervalo, exemplo: '2023-10-01T00:00:00Z'",
			})
			.datetime({ offset: true }),
		endBefore: z
			.string({
				required_error: "Data final é obrigatória",
				invalid_type_error: "Data final deve ser uma string",
				description: "Data final do intervalo, exemplo: '2023-10-01T00:00:00Z'",
			})
			.datetime({ offset: true }),
	})
	.strict()
	.refine((range) => isBefore(range.startAfter, range.endBefore), {
		message: "A data inicial deve ser anterior à data final",
	});
