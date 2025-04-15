import { eq } from "drizzle-orm";
import db from "../db/postgresConnection";
import { organizationsTable } from "../db/schema";
import { NewOrganization, Organization } from "../types/organizations.type";

export const createOrganization = (newOrg: NewOrganization) =>
	db.insert(organizationsTable).values(newOrg).returning();

export const getOrganizationById = (id: Organization["id"]) =>
	db.select().from(organizationsTable).where(eq(organizationsTable.id, id));
