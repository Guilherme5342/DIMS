import { InferInsertModel, InferSelectModel } from "drizzle-orm";
import { organizationsTable } from "../db/schema";

export type NewOrganization = InferInsertModel<typeof organizationsTable>;
export type Organization = InferSelectModel<typeof organizationsTable>;
