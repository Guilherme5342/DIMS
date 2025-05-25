import { and, asc, between, eq, ilike } from "drizzle-orm";
import db from "../db/postgresConnection";
import { haInstancesTable } from "../db/schema";
import {
    HaInstance,
    NewHaInstance,
    SearchHaInstancesParams,
} from "../types/haInstances.types";

export const createHaInstance = (newHaInstance: NewHaInstance) =>
	db.insert(haInstancesTable).values(newHaInstance).returning();

export const getHaInstanceById = (id: HaInstance["id"]) =>
	db.select().from(haInstancesTable).where(eq(haInstancesTable.id, id));

export const updateHaInstance = (id: HaInstance["id"], haInstance: Partial<HaInstance>) =>
	db
		.update(haInstancesTable)
		.set(haInstance)
		.where(eq(haInstancesTable.id, id))
		.returning();

export const softDeleteHaInstance = (id: HaInstance["id"]) =>
	db
		.update(haInstancesTable)
		.set({ deletedAt: new Date() })
		.where(eq(haInstancesTable.id, id))
		.returning();

export const deleteHaInstance = (id: HaInstance["id"]) =>
	db.delete(haInstancesTable).where(eq(haInstancesTable.id, id)).returning();

export const searchHaInstances = async (params: SearchHaInstancesParams) => {
	const conditions = [];

	params.id && conditions.push(eq(haInstancesTable.id, params.id));
	params.name && conditions.push(ilike(haInstancesTable.name, `%${params.name}%`));
	params.macAddress &&
		conditions.push(ilike(haInstancesTable.macAddress, `%${params.macAddress}%`));
	params.isActive && conditions.push(eq(haInstancesTable.isActive, params.isActive));
	params.organizationId &&
		conditions.push(eq(haInstancesTable.organizationId, params.organizationId));

	if (params.createdAfter && params.createdBefore) {
		conditions.push(
			between(
				haInstancesTable.createdAt,
				new Date(params.createdAfter),
				new Date(params.createdBefore)
			)
		);
	}
	if (params.updatedAfter && params.updatedBefore) {
		conditions.push(
			between(
				haInstancesTable.updatedAt,
				new Date(params.updatedAfter),
				new Date(params.updatedBefore)
			)
		);
	}

	const organizations = await db
		.select()
		.from(haInstancesTable)
		.where(and(...conditions))
		.orderBy(asc(haInstancesTable.name), asc(haInstancesTable.id))
		.groupBy(haInstancesTable.id)
		.limit(params.size)
		.offset((params.page - 1) * params.size);

	const total = await db.$count(haInstancesTable, and(...conditions));

	return {
		items: organizations,
		total: total,
		page: params.page,
		size: params.size,
	};
};
