import { Signal, Tracker } from '@vgerbot/solidium';
import {
    Storage,
    StorageLoadEvent,
    StorageLoadNotify
} from '@vgerbot/persistence';
import { Inject } from '@vgerbot/ioc';

export class AuthStateService {
    @Signal()
    @Storage({
        key: 'auth-token'
    })
    token?: string;

    @Signal()
    @Storage({
        key: 'auth-refresh-token'
    })
    refreshToken?: string;

    @Signal()
    @Storage({
        key: 'token-expires-at'
    })
    expiresAt: number = Date.now();
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
        return !!this.token;
    }

    get isExpired() {
        return !this.expiresAt || Date.now() >= this.expiresAt;
    }
    waitUntilAuthenticated() {
        if (this.isAuthenticated) {
            return Promise.resolve();
        }
        return this.tracker.until(() => this.isAuthenticated);
    }
    @StorageLoadNotify({
        members: ['token', 'expiresAt']
    })
    onLoadDataFromStorage(event: StorageLoadEvent<AuthStateService>) {
        if (this._initialized) {
            return;
        }
        this._initialized =
            event.loadedMembers.has('token') &&
            event.loadedMembers.has('expiresAt');
    }
}
