import { Endpoint, Get, Payload, Post, restfull } from '@vgerbot/http';
import { AuthInterceptor } from '../auth/AuthInterceptor';
import { BaseAPIEndpoint } from './BaseAPIEndpoint';

@Endpoint({
    extends: BaseAPIEndpoint,
    path: 'auth'
})
export class AuthAPI {
    @Post({
        path: 'login',
        excludeInterceptors: [AuthInterceptor]
    })
    login(@Payload() data: { username: string; password: string }) {
        return restfull<{
            status: string;
            data: {
                userId: string;
                username: string;
                role: string;
                accessToken: string;
                refreshToken: string;
                expiresIn: number;
            };
        }>(data);
    }
    @Post({
        path: 'token',
        excludeInterceptors: [AuthInterceptor],
        reactive: false
    })
    refreshToken(@Payload() data: { refreshToken: string }) {
        return restfull(data);
    }
    @Post('logout')
    logout() {
        return restfull();
    }
    @Get('profile')
    profile() {
        return restfull<{
            data: { id: string; username: string; role: string };
        }>();
    }
}
