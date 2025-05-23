import { InferInsertModel, InferSelectModel } from "drizzle-orm";
import { z } from "zod";
import { haInstancesTable } from "../db/schema";
import {
    haInstanceIdParam,
    newHaInstance,
    searchHaInstancesParams,
    updateHaInstance,
} from "../schemas/haInstances.schema";

export type NewHaInstance = InferInsertModel<typeof haInstancesTable>;
export type HaInstance = InferSelectModel<typeof haInstancesTable>;

export type NewHaInstanceBody = z.infer<typeof newHaInstance>;
export type UpdateHaInstanceBody = z.infer<typeof updateHaInstance>;
export type GetHaInstanceParams = z.infer<typeof haInstanceIdParam>;
export type SearchHaInstancesParams = z.infer<typeof searchHaInstancesParams>;
