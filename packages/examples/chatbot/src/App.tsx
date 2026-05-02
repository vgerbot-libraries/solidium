import { Http } from "@vgerbot/http";
import { Persistence } from "@vgerbot/persistence";
import { Solidium } from "@vgerbot/solidium";
import type { Component, ParentProps } from "solid-js";
import { AuthHandler } from "./auth/AuthHandler";
import { Notify } from "./components/notify";

const App: Component = (props: ParentProps) => {
	return (
		<Solidium autoRegisterClasses={[Persistence.default(), Http.configure({})]}>
			<main class="container">
				{props.children}
				<Notify.Alert></Notify.Alert>
			</main>
			<AuthHandler></AuthHandler>
		</Solidium>
	);
};

export default App;
