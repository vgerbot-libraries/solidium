import {
    AccessorOrValue,
    Endpoint,
    Get,
    PathVariable,
    restfull
} from '@vgerbot/http';
import { BaseAPIEndpoint } from './BaseAPIEndpoint';

@Endpoint({
    extends: BaseAPIEndpoint,
    path: 'users'
})
export class UserAPI {
    @Get(':userId')
    userInfo(
        @PathVariable('userId') userId: AccessorOrValue<string | undefined>
    ) {
        return restfull<{ data: { id: number; name: string; email: string } }>(
            userId
        );
    }
}
