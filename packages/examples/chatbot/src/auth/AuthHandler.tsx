import { useNavigate } from "@solidjs/router";
import { useService } from "@vgerbot/solidium";
import { onCleanup } from "solid-js";
import { AuthStateService } from "./AuthStateService";
export function AuthHandler() {
	const navigate = useNavigate();
	const service = useService(AuthStateService);
	onCleanup(
		service.onAuthStateChange((isAuthenticated, initialized) => {
			if (!initialized) {
				return;
			}
			if (!isAuthenticated) {
				navigate("/login", { replace: true });
			} else {
				navigate("/");
			}
		}),
	);
	return <></>;
}
