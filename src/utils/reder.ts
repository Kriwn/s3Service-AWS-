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

	async videoReader(key: string,data: GetObjectCommandOutput) {
		if (!data.Body) {
			return null;
		}
		const video = await data.Body.transformToByteArray();
		return new File([video], key, { type: data.ContentType });
	}

	async videoReaderHTTP(key: string,data: GetObjectCommandOutput) {
		if (!data.Body) {
			return null;
		}
		const video = await data.Body.transformToByteArray();
		const file = new File([video], key, { type: data.ContentType });
		return new Response(video, {
			headers: {
				"Content-Type": file.type,
			},
		});
	}
}

export default Render;
