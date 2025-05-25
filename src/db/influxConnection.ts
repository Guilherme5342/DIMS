import { InfluxDB } from "@influxdata/influxdb-client";
import {
    BucketsAPI,
    DeleteAPI,
    OrgsAPI,
    SetupAPI,
} from "@influxdata/influxdb-client-apis";
import ENV from "../env";

const INFLUXDB_URL = `http${ENV.isProd ? "s" : ""}://${ENV.INFLUXDB_HOST}:${ENV.INFLUXDB_PORT}`;
const influx = new InfluxDB({ url: INFLUXDB_URL, token: ENV.INFLUXDB_TOKEN });

export const whiteClient = (org: string, bucket: string) => {
	const writeClient = influx.getWriteApi(org, bucket);

	return writeClient;
};

export const queryClient = (org: string) => {
	const queryClient = influx.getQueryApi(org);

	return queryClient;
};

export const adminClient = {
	setup: new SetupAPI(influx),
	buckets: new BucketsAPI(influx),
	orgs: new OrgsAPI(influx),
	delete: new DeleteAPI(influx),
};
