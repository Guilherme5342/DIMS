import { Point } from "@influxdata/influxdb-client";
import { FastifyReply, FastifyRequest } from "fastify";
import { InfluxWriteClient } from "../db/influxConnection";

class DataController {
	async registerData(req: FastifyRequest, res: FastifyReply) {
		const writeClient = InfluxWriteClient("dims", "dims");

		for (let i = 0; i < 5; i++) {
			let point = new Point("test")
				.tag("temperature", "tagvalue1")
				.intField("field1", i);

			void setTimeout(() => {
				writeClient.writePoint(point);
			}, i * 1000); // separate points by 1 second

			void setTimeout(() => {
				writeClient.flush();
			}, 5000);
		}

		return { status: "ok" };
	}

	async getOrganization(req: FastifyRequest, res: FastifyReply) {
		return { hello: "world" };
	}
}

export default new DataController();
