import { Inject } from '@vgerbot/ioc';
import { AuthAPI } from './AuthAPI';
import { AuthStateService } from './AuthStateService';
import { ResourceError } from '@vgerbot/http';
import { NotifyService } from '../base/NotifyService';

export class AuthActionService {
    @Inject()
    private authAPI!: AuthAPI;
    @Inject()
    private authService!: AuthStateService;
    @Inject()
    private notifyService!: NotifyService;
    async login(data: { username: string; password: string }) {
        const startTime = Date.now();
        const resource = this.authAPI.login(data);
        try {
            const { data } = (await resource.wait()) ?? {};

            console.log(data);

            if (!data) {
                throw new Error('Login failed');
            }
            this.authService.updateAuthData({
                token: data.accessToken,
                refreshToken: data.refreshToken,
                expiresAt: data.expiresIn + startTime
            });

            return true;
        } catch (e: unknown) {
            console.error(e);
            if (e instanceof ResourceError) {
                const message = e.responseBody?.message;
                if (message) {
                    this.notifyService.alert({
                        title: 'Login failed',
                        message
                    });
                }
            }
        }
        return false;
    }
    async refresh() {
        const refreshToken = this.authService.getRefreshToken();
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
