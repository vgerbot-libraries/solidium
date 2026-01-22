import { DefaultDrivers, Persistence } from "@vgerbot/persistence";
import { Solidium } from "@vgerbot/solidium";
import { PostViewer } from "./cache/CacheExample";
import { AlertDialog } from "./components/AlertDialog";
import { LoginDialog } from "./components/LoginDialog";
import { Profile } from "./components/Profile";
import { RefreshToken } from "./components/RefreshToken";
import { UploadExample } from "./upload/UploadExample";

export function App() {
	return (
		<Solidium
			autoRegisterClasses={[
				Persistence.default({
					driver: DefaultDrivers.LOCAL_STORAGE,
					debug: true,
				}) as typeof Persistence,
			]}
		>
			<Profile></Profile>
			<span>{"=".repeat(100)}</span>
			<Profile></Profile>
			<RefreshToken></RefreshToken>
			<UploadExample></UploadExample>
			<span>{"=".repeat(100)}</span>
			<PostViewer></PostViewer>
			<AlertDialog></AlertDialog>
			<LoginDialog></LoginDialog>
			<hr></hr>
			<PostViewer></PostViewer>
		</Solidium>
	);
}
