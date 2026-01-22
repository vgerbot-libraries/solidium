import { useService } from "@vgerbot/solidium";
import "./index.css";
import { createSignal } from "solid-js";
import { AuthActionService } from "../../auth/AuthActionService";

export function LoginPage() {
	const authService = useService(AuthActionService);
	const [isBusy, setBusy] = createSignal(false);

	return (
		<section class="login-page">
			<h1>Sign in</h1>
			<form
				onSubmit={async (e) => {
					setBusy(true);
					try {
						e.preventDefault();
						const formData = new FormData(e.target as HTMLFormElement);
						const username = formData.get("username") as string;
						const password = formData.get("password") as string;
						await authService.login({
							username,
							password,
						});
					} finally {
						setBusy(false);
					}
				}}
			>
				<fieldset>
					<label>
						Email
						<input
							name="username"
							placeholder="Username"
							autocomplete="username"
						/>
					</label>
					<label>
						Password
						<input
							type="password"
							name="password"
							placeholder="Password"
							autocomplete="current-password"
						/>
					</label>
				</fieldset>
				<fieldset>
					<label for="remember">
						<input
							type="checkbox"
							role="switch"
							id="remember"
							name="remember"
						/>
						Remember me
					</label>
				</fieldset>

				<input type="submit" value="Login" aria-busy={isBusy()} />
			</form>
		</section>
	);
}
