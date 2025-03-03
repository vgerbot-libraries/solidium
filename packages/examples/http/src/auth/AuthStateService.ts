import { Signal, Tracker } from '@vgerbot/solidium';
import { Storage } from '@vgerbot/persistence';
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

    get isAuthenticated() {
        return !!this.token;
    }

    get isExpired() {
        return this.isAuthenticated && Date.now() >= this.expiresAt;
    }
    waitUntilAuthenticated() {
        if (this.isAuthenticated) {
            return Promise.resolve();
        }
        return this.tracker.until(() => this.isAuthenticated);
    }
}
