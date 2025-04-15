import { FastifyInstance, FastifyPluginOptions } from "fastify";
import { FastifyPluginAsyncZod } from "fastify-type-provider-zod";
import { z } from "zod";
import DataController from "../controllers/data.controller";
// import { newOrganization, organizationId } from "../schemas/data.schemas";

const dataRouter: FastifyPluginAsyncZod = async (fastify: FastifyInstance, options: FastifyPluginOptions) => {
	fastify.post(
		"/",
		{
			schema: {
				tags: ["organizations"],
				description: "Criar uma nova organização",
				summary: "Criar uma nova organização",
			},
		},
		DataController.registerData
	);
	fastify.get(
		"/:id",
		{
			schema: {
				tags: ["organizations"],
				description: "Pegar uma organização por ID",
				summary: "Pegar uma organização por ID",
			},
		},
		DataController.getOrganization
	);

	// fastify.get(
        // queryClient = client.getQueryApi(org)
        // fluxQuery = `from(bucket: "<BUCKET>")
        //  |> range(start: -10m)
        //  |> filter(fn: (r) => r._measurement == "measurement1")
        //  |> mean()`

        // queryClient.queryRows(fluxQuery, {
        //   next: (row, tableMeta) => {
        //     const tableObject = tableMeta.toObject(row)
        //     console.log(tableObject)
        //   },
        //   error: (error) => {
        //     console.error('\nError', error)
        //   },
        //   complete: () => {
        //     console.log('\nSuccess')
        //   },
        // })
	// );
};

export default dataRouter;
