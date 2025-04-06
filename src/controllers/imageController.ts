import Elysia, { error, t } from "elysia";
import s3Repository from "../repositories/s3Repository";
import Render from "../utils/reder";


const prefix = "images";
const imageController = new Elysia({
	prefix: "/api/image",
	tags: ["Image"],
})

imageController.get(
	"/",
	async () => {
		const bucket = process.env.AWS_BUCKET as string;
		const s3Repositories = new s3Repository();
		const response = await s3Repositories.getList(bucket, prefix);
		const imageList = response.Contents?.filter((content) => content.Key)
			.map((content) => content.Key ?? "") ?? [];
		return imageList;
	}, {
	detail: {
		sumarry: "List all images from s3",
		detail: "List all images from s3",
	}
});

imageController.get(
	"/:key",
	async ({ params }) => {
		const bucket = process.env.AWS_BUCKET as string;
		const newkey = prefix+"/"+params.key.trim().replace(/\s+/g, "_");
		const s3Repositories = new s3Repository();
		const render = new Render();
		const response = await s3Repositories.getObject(bucket, newkey);
		const image = await render.videoReader( params.key, response);
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
			sumarry: "Get a image from s3 and return a file",
			detail: "Get a object from s3 and return a file",
		}

	}
);

imageController.get(
	"/http/:key",
	async ({ params }) => {
		const bucket = process.env.AWS_BUCKET as string;
		const s3Repositories = new s3Repository();
		const newkey = prefix+"/"+params.key.trim().replace(/\s+/g, "_");
		const render = new Render();
		const response = await s3Repositories.getObject(bucket, newkey);
		const image = await render.videoReaderHTTP(params.key, response);
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
			sumarry: "Get a object from s3 and return a http response",
			detail: "Get a object from s3 and return a http response",
		}

	}
);

imageController.post(
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
				contentType: "image/*",
				error: {
					type: "invalid_file_type",
					message: "Invalid image file type"
				}
			}),
			typeFile: t.Optional(t.String())
		}),
		detail: {
			sumarry: "Create a image",
			detail: "Create a image",
		}
	}
);

imageController.delete(
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
			sumarry: "Delete a image",
			detail: "Delete a image",
		}
	}
);


export default imageController;
