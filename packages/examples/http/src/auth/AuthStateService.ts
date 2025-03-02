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

    expiresIn: number = Date.now();

    get isAuthenticated() {
        return !!this.token;
    }
}
