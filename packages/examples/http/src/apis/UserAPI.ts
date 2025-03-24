import { R, Endpoint, Get, PathVariable, restfull, SWR } from '@vgerbot/http';
import { BaseAPIEndpoint } from './BaseAPIEndpoint';

@Endpoint({
    extends: BaseAPIEndpoint,
    path: 'users'
})
export class UserAPI {
    @Get(':userId')
    @SWR({
        revalidate: {
            focus: true
        }
    })
    userInfo(@PathVariable('userId') userId: R<string>) {
        return restfull<{ data: { id: number; name: string; email: string } }>(
            userId
        );
    }
}
