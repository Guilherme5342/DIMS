import { and, asc, between, eq, getTableColumns, ilike, isNull, or } from "drizzle-orm";
import db from "../db/postgresConnection";
import { organizationsTable } from "../db/schema";
import {
    NewOrganization,
    Organization,
    SearchOrgParams,
} from "../types/organizations.types";

const { deletedAt, ...columns } = getTableColumns(organizationsTable);

export const createOrganization = (newOrg: NewOrganization) =>
	db.insert(organizationsTable).values(newOrg).returning(columns);

export const updateOrganization = (
	id: Organization["id"],
	org: Partial<NewOrganization>
) =>
	db
		.update(organizationsTable)
		.set(org)
		.where(and(eq(organizationsTable.id, id), isNull(organizationsTable.deletedAt)))
		.returning(columns);

export const softDeleteOrganization = (id: Organization["id"]) =>
	db
		.update(organizationsTable)
		.set({ deletedAt: new Date() })
		.where(eq(organizationsTable.id, id))
		.returning(columns);

export const deleteOrganization = (id: Organization["id"]) =>
	db.delete(organizationsTable).where(eq(organizationsTable.id, id)).returning();

export const getOrganizationById = (id: Organization["id"]) =>
	db
		.select(columns)
		.from(organizationsTable)
		.where(and(eq(organizationsTable.id, id), isNull(organizationsTable.deletedAt)));

export const checkOrgNameAndBucket = (
	org: Organization["orgName"],
	bucket: Organization["bucketName"]
) =>
	db
		.select(columns)
		.from(organizationsTable)
		.where(
			or(
				eq(organizationsTable.orgName, org),
				eq(organizationsTable.bucketName, bucket)
			)
		);

export const searchOrganizations = async (params: SearchOrgParams) => {
	const conditions = [];

	conditions.push(isNull(organizationsTable.deletedAt));
	params.id && conditions.push(eq(organizationsTable.id, params.id));
	params.name && conditions.push(ilike(organizationsTable.name, `%${params.name}%`));
	params.email && conditions.push(eq(organizationsTable.email, params.email));
	params.description &&
		conditions.push(ilike(organizationsTable.description, `%${params.description}%`));
	params.isActive && conditions.push(eq(organizationsTable.isActive, params.isActive));

	if (params.createdAtRange) {
		conditions.push(
			between(
				organizationsTable.createdAt,
				new Date(params.createdAtRange.after),
				new Date(params.createdAtRange.before)
			)
		);
	}
	if (params.updatedAtRange) {
		conditions.push(
			between(
				organizationsTable.updatedAt,
				new Date(params.updatedAtRange.after),
				new Date(params.updatedAtRange.before)
			)
		);
	}

	const organizations = await db
		.select(columns)
		.from(organizationsTable)
		.where(and(...conditions))
		.orderBy(asc(organizationsTable.name), asc(organizationsTable.id))
		.groupBy(organizationsTable.id)
		.limit(params.size)
		.offset((params.page - 1) * params.size);

	const total = await db.$count(organizationsTable, and(...conditions));

	return {
		items: organizations,
		total: total,
		page: params.page,
		size: params.size,
	};
};
