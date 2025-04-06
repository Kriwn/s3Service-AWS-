import { Elysia, redirect } from "elysia";
import swagger from "@elysiajs/swagger";
import s3Controller from "./controllers/imageController";
import cors from "@elysiajs/cors";


const app = new Elysia()
	.use(cors())
	.use(swagger({
		path: "api/docs",
		documentation: {
			info: { title: "S3 API", version: "1.0.0" },
		},
	})
	);

app.get(
	"/",
	() => {
		return redirect("/api/docs");
	},
	{ detail: { tags: ["Home"], summary: "Home", description: "Redirect to API docs" } }
);

app.use(s3Controller);

app.listen(3000);

console.log(
	`🦊 Elysia is running at ${app.server?.hostname}:${app.server?.port}`
);
