import { useService } from "@vgerbot/solidium";
import { Button, Form, Modal } from "solid-bootstrap";
import { createSignal } from "solid-js";
import { AuthActionService } from "../auth/AuthActionService";
import { AuthStateService } from "../auth/AuthStateService";

export function LoginDialog() {
	const [username, setUserName] = createSignal("admin");
	const [password, setPassword] = createSignal("admin123");
	const authService = useService(AuthStateService);
	const authActionService = useService(AuthActionService);

	return (
		<Modal
			show={authService.isInitialized && !authService.isAuthenticated}
			centered
		>
			<Modal.Header>
				<Modal.Title>Login</Modal.Title>
			</Modal.Header>
			<Form>
				<Modal.Body>
					<Form.Group class="mb-3">
						<Form.Label>Username</Form.Label>
						<Form.Control
							type="text"
							placeholder="Username"
							value={username()}
							onChange={(e: any) => {
								setUserName(e.target.value);
							}}
						></Form.Control>
					</Form.Group>
					<Form.Group class="mb-3">
						<Form.Label>Password</Form.Label>
						<Form.Control
							type="password"
							placeholder="password"
							value={password()}
							onChange={(e: any) => {
								setPassword(e.target.value);
							}}
						></Form.Control>
					</Form.Group>
				</Modal.Body>
				<Modal.Footer>
					<Button
						onClick={() => {
							authActionService.login({
								username: username(),
								password: password(),
							});
						}}
					>
						Login
					</Button>
				</Modal.Footer>
			</Form>
		</Modal>
	);
}
