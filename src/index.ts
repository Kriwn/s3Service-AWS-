import { Elysia, redirect } from "elysia";
import swagger from "@elysiajs/swagger";
import cors from "@elysiajs/cors";
import imageController from "./controllers/imageController";
import videoController from "./controllers/videoController";


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

app.use(imageController);
app.use(videoController);

app.listen(3000);

console.log(
	`🦊 Elysia is running at ${app.server?.hostname}:${app.server?.port}`
);
