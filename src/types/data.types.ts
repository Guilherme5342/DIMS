import { z } from "zod";
import { deleteData, newData, searchData } from "../schemas/data.schema";

export type InfluxRowData = {
	result: string;
	table: number;
	_start: string;
	_stop: string;
	_time: string;
	_value: string;
	_field: string;
	_measurement: string;
	raw: string;
	tag: string;
	unit: string;
};

export type NewData = z.infer<typeof newData>;
export type DeleteData = z.infer<typeof deleteData>;
export type SearchData = z.infer<typeof searchData>;

export type RowData = Omit<NewData, "orgId">;
