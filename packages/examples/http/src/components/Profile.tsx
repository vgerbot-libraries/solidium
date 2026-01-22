import { useService } from "@vgerbot/solidium";
import { UserAPI } from "../apis/UserAPI";
import { AuthActionService } from "../auth/AuthActionService";

export function Profile() {
	const service = useService(AuthActionService);
	const profile = service.profile();
	const userAPI = useService(UserAPI);
	const info = userAPI.userInfo(() => profile.data?.data?.id);
	return (
		<div>
			<div>ID: {profile.data?.data?.id}</div>
			<div>Name: {profile.data?.data?.username}</div>
			<div>Role: {profile.data?.data?.role}</div>
			<div>Email: {info.data?.data?.email}</div>
			<button onClick={() => service.refresh()}>Refresh</button>
		</div>
	);
}
