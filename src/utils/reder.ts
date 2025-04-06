import { GetObjectCommandOutput } from "@aws-sdk/client-s3";
import { error } from "elysia";

class Render {

	async imageReader(key: string,data: GetObjectCommandOutput): Promise<File | null> {
		if (!data.Body) {
			return null;
		}
		const image = await data.Body.transformToByteArray();

		return new File([image], key, { type: data.ContentType });
	}

	async imageReaderHTTP(key: string,data: GetObjectCommandOutput) {
		if (!data.Body) {
			return null;
		}
		const image = await data.Body.transformToByteArray();
		const file = new File([image], key, { type: data.ContentType });

		return new Response(image, {
			headers: {
				"Content-Type": file.type,
			},
		});
	}

	async vedioReader(key: string,data: GetObjectCommandOutput) {
		if (!data.Body) {
			return null;
		}
		const vedio = await data.Body.transformToByteArray();
		return new File([vedio], key, { type: data.ContentType });
	}

	async vedioReaderHTTP(key: string,data: GetObjectCommandOutput) {
		if (!data.Body) {
			return null;
		}
		const vedio = await data.Body.transformToByteArray();
		const file = new File([vedio], key, { type: data.ContentType });
		return new Response(vedio, {
			headers: {
				"Content-Type": file.type,
			},
		});
	}
}

export default Render;
