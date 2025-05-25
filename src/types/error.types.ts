export type ZodError = {
	error: string;
	message: string;
	statusCode: number;
	path: string;
	details: {
		field: string;
		message: string;
	}[];
};

export type PostgresError = {
	error: string;
	message: string;
	statusCode: number;
	path: string;
	details: {
		pgCode: string;
		constraint: string;
		table: string;
	};
};

export type DefaultError = {
	error: string;
	message: string;
	statusCode: number;
	path: string;
};
