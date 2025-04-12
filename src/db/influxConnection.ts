import { InfluxDB } from "@influxdata/influxdb-client";
import ENV from "../env";

const influx = new InfluxDB({ url: ENV.INFLUX_URL, token: ENV.INFLUX_TOKEN });

export const InfluxWriteClient = (org: string, bucket: string) => {
	const writeClient = influx.getWriteApi(org, bucket);

	return writeClient;
};

export const InfluxQueryClient = (org: string, bucket: string) => {
	const queryClient = influx.getQueryApi(org);

	return queryClient;
};
