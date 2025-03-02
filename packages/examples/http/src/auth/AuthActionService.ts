import { Inject } from '@vgerbot/ioc';
import { AuthAPI } from '../apis/AuthAPI';
import { AuthStateService } from './AuthStateService';

export class AuthActionservice {
    @Inject()
    private authAPI!: AuthAPI;
    @Inject()
    private authService!: AuthStateService;
    async login(data: { username: string; password: string }) {
        const startTime = Date.now();
        const ret = await this.authAPI.login(data);
        console.log(ret);
        this.authService.token = ret.data.accessToken;
        this.authService.refreshToken = ret.data.refreshToken;
        this.authService.expiresIn = ret.data.expiresIn * 1000 + startTime;
    }
    async refresh() {
        const refreshToken = this.authService.refreshToken;
        if (!refreshToken) {
            throw new Error('refresh token is empty');
        }
        const data = await this.authAPI.refreshToken({
            refreshToken
        });
        console.log(data);
    }
}
