import { Endpoint, Payload, Post, restfull } from '@vgerbot/http';
import { BaseAPIEndpoint } from './BaseAPIEndpoint';

@Endpoint({
    extends: BaseAPIEndpoint,
    path: 'auth'
})
export class AuthAPI {
    @Post({
        path: 'login'
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
    @Post('token')
    refreshToken(@Payload() data: { refreshToken: string }) {
        return restfull(data);
    }
    @Post('logout')
    logout() {
        return restfull();
    }
}
