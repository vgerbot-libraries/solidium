// @ts-nocheck

import { Inject } from '@vgerbot/ioc';

@Endpoint({
    baseURL: 'https://api.alovajs.dev',
    timeout: 2000,
    requestAdaptor: axiosRequestAdapter()
})
class BaseAPIEndpoint {}

class AuthService {
    @Storage()
    token = 'xxx';
}
class AuthInterceptor implements RequestInterceptor {
    @Inject()
    service: AuthService;
    beforeRequest(method) {
        method.headers['Authorization'] = 'Bearer xxx';
    }
}

@Endpoint({
    extends: BaseAPIEndpoint
})
class AuthAPIService {
    @Inject()
    service: AuthService;
    @Post({})
    login() {
        return restful(...arguments).then(result => {
            this.service.token = result.data.token;
            return result;
        });
    }
    logout() {
        this.service.token = '';
    }
    @Track(_ => _.service.token)
    private watch() {
        if (this.service.token === '') {
            // reload page when token is empty
            location.reload();
        } else {
            // do something else when login
        }
    }
}

@Endpoint({
    extends: BaseAPIEndpoint,
    interceptors: [AuthInterceptor]
})
class TODOAPIService {
    @Get('/res')
    getTodoList(@Query('userId') userId: string) {
        return restful(...arguments);
    }
}
