import {
	Endpoint,
	Get,
	PathVariable,
	Payload,
	Post,
	Query,
	type R,
	restful,
} from "@vgerbot/solidium-http";

export interface ObjectDef {
	id: string;
	name: string;
	data: Record<string, unknown>;
}

@Endpoint({
	baseURL: "https://api.restful-api.dev/",
})
export class ObjectsEndpoint {
	@Get("objects")
	listAll() {
		return restful<ObjectDef[]>();
	}
	@Get("objects/:id")
	getItem(@PathVariable("id") id: R<string>) {
		return restful<ObjectDef>(id);
	}
	@Get("objects")
	listObjectByIds(@Query("id") ids: string[]) {
		return restful<ObjectDef[]>(ids);
	}
	@Post("objects")
	addObject(@Payload() data: ObjectDef) {
		return restful<ObjectDef>(data);
	}
}
