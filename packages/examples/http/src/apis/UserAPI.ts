import {
    R,
    Endpoint,
    Get,
    PathVariable,
    restfull,
    SWR,
    Put,
    Payload,
    Mutate
} from '@vgerbot/http';
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
    @Put(':userId')
    @Mutate((userId: string) => `users/${userId}`)
    updateUser(
        @PathVariable('userId') userId: R<string>,
        @Payload() userInfo: R<{ name: string; email: string }>
    ) {
        return restfull(userId, userInfo);
    }
}
