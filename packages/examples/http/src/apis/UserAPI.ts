import {
	Endpoint,
	Get,
	PathVariable,
	Payload,
	Put,
	type R,
	restful,
	SWR,
	SWRMutation,
} from "@vgerbot/solidium-http";
import { BaseAPIEndpoint } from "./BaseAPIEndpoint";

@Endpoint({
	extends: BaseAPIEndpoint,
	path: "users",
})
export class UserAPI {
	@Get(":userId")
	@SWR({
		revalidate: {
			focus: false,
		},
	})
	userInfo(@PathVariable("userId") userId: R<string>) {
		return restful<{ data: { id: number; name: string; email: string } }>(
			userId,
		);
	}
	@Put(":userId")
	@SWRMutation((userId: string) => `users/${userId}`)
	updateUser(
		@PathVariable("userId") userId: R<string>,
		@Payload() userInfo: R<{ name: string; email: string }>,
	) {
		return restful(userId, userInfo);
	}
}
