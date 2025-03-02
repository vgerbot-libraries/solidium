import { Endpoint, Get, Payload, Post, restfull } from '@vgerbot/http';
import { BaseAPIEndpoint } from './BaseAPIEndpoint';
import { AuthInterceptor } from '../auth/AuthInterceptor';

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
        excludeInterceptors: [AuthInterceptor]
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
        return restfull<{ data: { id: string; name: string; role: string } }>();
    }
}
