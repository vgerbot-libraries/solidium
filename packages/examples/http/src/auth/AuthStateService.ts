import { Signal } from '@vgerbot/solidium';
import { Storage } from '@vgerbot/persistence';

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

    get isAuthenticated() {
        return !!this.token;
    }

    get isExpired() {
        return true;
        // return Date.now() >= this.expiresAt;
    }
}
