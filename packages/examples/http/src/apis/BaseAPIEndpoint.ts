import { Endpoint } from "@vgerbot/http";
import { AuthInterceptor } from "../auth/AuthInterceptor";
import { HandleErrorInterceptor } from "../base/HandleErrorInterceptor";

@Endpoint({
	baseURL: "http://localhost:3000/api/",
	interceptors: [HandleErrorInterceptor, AuthInterceptor],
})
// eslint-disable-next-line @typescript-eslint/no-extraneous-class
export class BaseAPIEndpoint {
	//
}
