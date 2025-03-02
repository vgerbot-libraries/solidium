import { Endpoint, Payload, Post, restfull } from '@vgerbot/http';
import { AuthInterceptor } from '../auth/AuthInterceptor';

@Endpoint({
    baseURL: 'http://localhost:3000/api/auth',
    interceptors: [AuthInterceptor]
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
