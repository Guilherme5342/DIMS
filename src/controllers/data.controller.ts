import { FluxTableMetaData, Point } from "@influxdata/influxdb-client";
import { differenceInHours, subHours } from "date-fns";
import { FastifyReply, FastifyRequest } from "fastify";
import { adminClient, queryClient, whiteClient } from "../db/influxConnection";
import { getOrganizationById } from "../repositories/organizations.repository";
import {
    DeleteData,
    InfluxRowData,
    NewData,
    RowData,
    SearchData,
} from "../types/data.types";

class DataController {
	async registerData(req: FastifyRequest<{ Body: NewData }>, res: FastifyReply) {
		const newData = req.body;

		const [org] = await getOrganizationById(newData.orgId);

		if (!org) {
			return res.status(404).send({ message: "Organização não encontrada" });
		}

		const writeApi = whiteClient(org.orgId, org.bucketId);

		const point = new Point(newData.sensorName)
			.stringField("value", newData.value)
			.tag("unit", newData.unit)
			.timestamp(new Date(newData.date));

		if (newData.raw) {
			point.tag("raw", JSON.stringify(newData.raw));
		}

		if (newData.tag) {
			point.tag("tag", newData.tag);
		}

		try {
			writeApi.writePoint(point);
		} catch (error) {
			return res.status(500).send({ message: "Erro ao salvar dados" });
		}

		await writeApi.close();

		return res.status(201).send({ message: "Dados salvos com sucesso" });
	}

	async deleteData(req: FastifyRequest<{ Body: DeleteData }>, res: FastifyReply) {
		const deleteData = req.body;

		const [org] = await getOrganizationById(deleteData.orgId);

		if (!org) {
			return res.status(404).send({ message: "Organização não encontrada" });
		}

		let predicate = "";
		if (deleteData.sensorName) {
			predicate += `_measurement="${deleteData.sensorName}"`;
		}

		if (deleteData.tag) {
			if (deleteData.sensorName) {
				predicate += ` and `;
			}
			predicate += `"tag"="${deleteData.tag}"`;
		}

		await adminClient.delete
			.postDelete({
				body: {
					start: deleteData.deleteRange.after,
					stop: deleteData.deleteRange.before,
					predicate: predicate,
				},
				orgID: org.orgId,
				bucketID: org.bucketId,
			})
			.catch((error) => {
				console.error("Error deleting data:", error);
				return res.status(500).send({ message: "Erro ao excluir dados" });
			});

		return res.status(200).send({ message: "Dados excluídos com sucesso" });
	}

	async searchData(
		req: FastifyRequest<{ Querystring: SearchData }>,
		res: FastifyReply
	) {
		const searchData = req.query;

		const [org] = await getOrganizationById(searchData.orgId);

		if (!org) {
			return res.status(404).send({ message: "Organização não encontrada" });
		}

		const queryApi = queryClient(org.orgId);

		let queryString = `from(bucket: "${org.bucketName}")\n`;

		if (searchData.startAfter && searchData.endBefore) {
			queryString += `|> range(start: ${searchData.startAfter}, stop: ${searchData.endBefore})\n`;
		} else {
			const now = new Date();
			const start = subHours(now, 24); // Default to 24 hours ago
			queryString += `|> range(start: ${start.toISOString()})\n`;
		}

		if (searchData.sensorName) {
			queryString += `|> filter(fn: (r) => r._measurement == "${searchData.sensorName}")\n`;
		}

		if (searchData.tags && searchData.tags.length > 0) {
			const tagsFilter = searchData.tags
				.map((tag) => `r.tag == "${tag}"`)
				.join(" or ");

			queryString += `|> filter(fn: (r) => ${tagsFilter})\n`;
		}

		queryString += `|> yield(name: "mean")`;

		const results: RowData[] = [];

		for await (const { values, tableMeta } of queryApi.iterateRows(queryString)) {
			const row = tableMeta.toObject(values) as InfluxRowData;
			results.push({
				sensorName: row._measurement,
				value: row._value,
				date: row._time,
				unit: row.unit,
				tag: row.tag,
				raw: row.raw,
			});
		}

		if (results.length === 0) {
			return res.status(404).send({ message: "Nenhum dado encontrado" });
		}

		return res.status(200).send(results);
	}
}

export default new DataController();
