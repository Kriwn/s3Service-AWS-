import Elysia, { error, t } from "elysia";
import s3Repository from "../repositories/s3Repository";
import Render from "../utils/reder";


const prefix = "videos";
const vedioController = new Elysia({
	prefix: "/api/video",
	tags: ["Video"],
})


vedioController.get(
	"/",
	async () => {
		const bucket = process.env.AWS_BUCKET as string;
		const s3Repositories = new s3Repository();
		const response = await s3Repositories.getList(bucket, prefix);
		const videoList = response.Contents?.filter((content) => content.Key)
			.map((content) => content.Key ?? "") ?? [];
		return videoList;
	}, {
	detail: {
		sumarry: "List all vedio from s3",
		detail: "List all vedio from s3",
	}
});

vedioController.get(
	"/:key",
	async ({ params }) => {
		const bucket = process.env.AWS_BUCKET as string;
		const newkey = prefix+"/"+params.key.trim().replace(/\s+/g, "_");
		const s3Repositories = new s3Repository();
		const render = new Render();
		const response = await s3Repositories.getObject(bucket, newkey);
		const image = await render.imageReader( params.key, response);
		if (!image) {
			return error(404, { error: "Dont have images in this bucket" });
		}
		return image;
	},
	{
		params: t.Object({
			key: t.String(),
		}),
		detail: {
			sumarry: "Get a vedio from s3 and return a file",
			detail: "Get a vedio from s3 and return a file",
		}

	}
);

vedioController.get(
	"/http/:key",
	async ({ params }) => {
		const bucket = process.env.AWS_BUCKET as string;
		const s3Repositories = new s3Repository();
		const newkey = prefix+"/"+params.key.trim().replace(/\s+/g, "_");
		const render = new Render();
		const response = await s3Repositories.getObject(bucket, newkey);
		const image = await render.imageReaderHTTP(params.key, response);
		if (!image) {
			return error(404, { error: "Dont have images in this bucket" });
		}
		return image;
	},
	{
		params: t.Object({
			key: t.String(),
		}),
		detail: {
			sumarry: "Get a vedio from s3 and return a http response",
			detail: "Get a vedio from s3 and return a http response",
		}

	}
);

vedioController.post(
	"/",
	async ({ body }) => {
		const bucket = process.env.AWS_BUCKET as string
		const newkey = prefix+"/"+body.key.trim().replace(/\s+/g, "_");
		const s3Repositories = new s3Repository();
		const response = await s3Repositories.putObject(bucket, newkey, body.file, body.typeFile);
		return response;
	},
	{
		body: t.Object({
			key: t.String(),
			file: t.File({
				contentType: "video/*",
				error: {
					type: "invalid_file_type",
					message: "Invalid video file type"
				}
			}),
			typeFile: t.Optional(t.String())
		}),
		detail: {
			sumarry: "Create a vedio",
			detail: "Create a vedio",
		}
	}
);

vedioController.delete(
	"/",
	async ({ body }) => {
		const bucket = process.env.AWS_BUCKET as string;
		const newkey = prefix+"/"+body.key.trim().replace(/\s+/g, "_");
		const s3Repositories = new s3Repository();
		const response = await s3Repositories.deleteObject(bucket, newkey);
		return response;
	},
	{
		body: t.Object({
			key: t.String(),
		}),
		detail: {
			sumarry: "Delete a vedio",
			detail: "Delete a vedio",
		}
	}
);

export default vedioController;
