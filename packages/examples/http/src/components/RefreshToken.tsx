import { useService } from "@vgerbot/solidium";
import { Button } from "solid-bootstrap";
import { AuthActionService } from "../auth/AuthActionService";

export function RefreshToken() {
	const service = useService(AuthActionService);
	return (
		<Button
			onClick={() => {
				service.refresh();
			}}
		>
			Refresh Token
		</Button>
	);
}
