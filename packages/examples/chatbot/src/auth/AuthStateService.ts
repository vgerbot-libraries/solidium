import { Inject } from "@vgerbot/ioc";
import {
	OnStorageLoad,
	Storage,
	type StorageLoadEvent,
} from "@vgerbot/persistence";
import { Signal, type Tracker } from "@vgerbot/solidium";

export interface AuthData {
	token: string;
	refreshToken: string;
	expiresAt: number;
}

export class AuthStateService {
	@Signal()
	@Storage({
		key: "auth-data",
	})
	private data?: AuthData;

	@Inject()
	tracker!: Tracker;

	@Signal()
	private _initialized = false;

	get isInitialized() {
		return this._initialized;
	}

	get isAuthenticated() {
		return this.hasToken && !this.isExpired;
	}

	get hasToken() {
		return !!this.data?.token;
	}

	get isExpired() {
		return !this.data?.expiresAt || Date.now() >= this.data.expiresAt;
	}

	getRefreshToken() {
		return this.data?.refreshToken;
	}

	updateAuthData(data: AuthData) {
		this._initialized = true;
		this.data = data;
	}

	waitUntilAuthenticated() {
		if (this.isAuthenticated) {
			return Promise.resolve();
		}
		return this.tracker.until(() => this.isAuthenticated);
	}
	@OnStorageLoad({
		members: ["data"],
	})
	onLoadDataFromStorage(event: StorageLoadEvent<AuthStateService>) {
		if (this._initialized) {
			return;
		}
		this._initialized = event.loadedMembers.has("data");
	}

	onAuthStateChange(
		listener: (isAuthenticated: boolean, initialized: boolean) => void,
	) {
		return this.tracker.track(() => {
			listener(this.isAuthenticated, this._initialized);
		});
	}
}
