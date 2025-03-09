import { Inject } from '@vgerbot/ioc';
import { AuthAPI } from '../apis/AuthAPI';
import { AuthStateService } from './AuthStateService';

export class AuthActionService {
    @Inject()
    private authAPI!: AuthAPI;
    @Inject()
    private authService!: AuthStateService;
    async login(data: { username: string; password: string }) {
        const startTime = Date.now();
        const resource = this.authAPI.login(data);
        try {
            console.log(await resource);
            const { data } = await resource;
            this.authService.token = data.accessToken;
            this.authService.refreshToken = data.refreshToken;
            this.authService.expiresAt = data.expiresIn * 1000 + startTime;
        } catch (e: unknown) {
            console.error(e);
        }
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
    profile() {
        return this.authAPI.profile();
    }
}
