import { Endpoint, Get, jsonsse } from '@vgerbot/http';

@Endpoint({
    baseURL: 'https://sse-fake.andros.dev/'
})
export class SSEEndpoint {
    @Get('events/')
    events() {
        return jsonsse<object>();
    }
}
