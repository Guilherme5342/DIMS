import { z } from "zod";

export const zodErrorSchema = z.object({
	error: z.string(),
	message: z.string(),
	statusCode: z.number(),
	path: z.string(),
	details: z.array(
		z.object({
			field: z.string(),
			message: z.string(),
		})
	),
}).describe("Erro de validação do schema");

export const postgresErrorSchema = z.object({
	error: z.string(),
	message: z.string(),
	statusCode: z.number(),
	path: z.string(),
	details: z.object({
		pgCode: z.string(),
		constraint: z.string(),
		table: z.string(),
	}),
}).describe("Erro de integração PostgreSQL");

export const defaultErrorSchema = z.object({
	error: z.string(),
	message: z.string(),
	statusCode: z.number(),
	path: z.string(),
}).describe("Erro do sistema");
