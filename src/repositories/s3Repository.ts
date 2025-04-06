import { DeleteObjectCommand, GetObjectCommand, GetObjectCommandOutput, ListObjectsV2Command, PutObjectCommand} from "@aws-sdk/client-s3";
import s3Client from "../config/s3";
class s3Repository {

	async getObject(
		bucket: string,
		key: string
	): Promise<GetObjectCommandOutput> {
		const command = new GetObjectCommand({
			Bucket: bucket,
			Key: key,
		});
		const response = await s3Client.send(command);
		return response;
	}

	async getList(bucket: string, prefix: string) {
		const command = new ListObjectsV2Command({
			Bucket: bucket,
			Prefix: prefix,
		});
		const response = await s3Client.send(command);
		return response;
	}

	async putObject(bucket: string, key: string, body: File, typeFile?: string) {
		const arrayBuffer = await body.arrayBuffer();
		const command = new PutObjectCommand({
			Bucket: bucket,
			Key: key,
			Body: arrayBuffer as unknown as Blob,
			ContentType: typeFile || body.type,
		});
		const response = await s3Client.send(command);
		return response;
	}

	async deleteObject(bucket: string, key: string) {
		const command = new DeleteObjectCommand({
			Bucket: bucket,
			Key: key,
		});
		const response = await s3Client.send(command);
		return response;
	}

}

export default s3Repository;
