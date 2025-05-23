import { InferInsertModel, InferSelectModel } from "drizzle-orm";
import { z } from "zod";
import { organizationsTable } from "../db/schema";
import {
    newOrganization,
    orgIdParam,
    searchOrgParams,
    updateOrganization,
} from "../schemas/organizations.schemas";

export type NewOrganization = InferInsertModel<typeof organizationsTable>;
export type Organization = InferSelectModel<typeof organizationsTable>;

export type NewOrganizationBody = z.infer<typeof newOrganization>;
export type UpdateOrganizationBody = z.infer<typeof updateOrganization>;
export type GetOrganizationParams = z.infer<typeof orgIdParam>;
export type SearchOrgParams = z.infer<typeof searchOrgParams>;
