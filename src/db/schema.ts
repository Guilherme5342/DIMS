import { sql } from "drizzle-orm";
import {
    boolean,
    index,
    macaddr,
    pgTable,
    text,
    timestamp,
    unique,
    uuid,
    varchar,
} from "drizzle-orm/pg-core";

export const organizationsTable = pgTable(
	"organizations",
	{
		id: uuid("id")
			.primaryKey()
			.default(sql`gen_random_uuid()`),
		name: varchar("name", { length: 255 }).notNull(),
		email: varchar("email", { length: 255 }).notNull(),
		description: text("description"),
		orgName: text("org_name").notNull(),
		orgId: text("org_id").notNull(),
		bucketName: text("bucket").notNull(),
		bucketId: text("bucket_id").notNull(),
		isActive: boolean("is_active").notNull().default(true),
		createdAt: timestamp("created_at").notNull().defaultNow(),
		updatedAt: timestamp("updated_at", { mode: "date", precision: 3 })
			.notNull()
			.defaultNow()
			.$onUpdate(() => new Date()),
		deletedAt: timestamp("deleted_at"),
	},
	(table) => [index("organizations_name_index").on(table.name)]
);

export const hacsInstancesTable = pgTable(
	"ha_instances",
	{
		id: uuid("id")
			.primaryKey()
			.default(sql`gen_random_uuid()`),
		organizationId: uuid("organization_id")
			.notNull()
			.references(() => organizationsTable.id, {
				onDelete: "cascade",
				onUpdate: "cascade",
			}),
		name: varchar("name", { length: 255 }).notNull(),
		macAddress: macaddr("mac_address").notNull(),
		isActive: boolean("is_active").default(true),
		createdAt: timestamp("created_at").defaultNow(),
		updatedAt: timestamp("updated_at", { mode: "date", precision: 3 })
			.notNull()
			.defaultNow()
			.$onUpdate(() => new Date()),
		deletedAt: timestamp("deleted_at"),
	},
	(table) => [
		index("ha_instances_name_index").on(table.name),
		unique("ha_instances_organization_id_name_key").on(
			table.organizationId,
			table.name
		),
	]
);
