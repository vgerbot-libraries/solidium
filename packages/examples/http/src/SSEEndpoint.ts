import { Endpoint, Get, jsonsse } from "@vgerbot/solidium-http";

@Endpoint({
	baseURL: "https://sse-fake.andros.dev/",
})
export class SSEEndpoint {
	@Get("events/")
	events() {
		return jsonsse<object>();
	}
}
