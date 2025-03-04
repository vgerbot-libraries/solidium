import { Endpoint, Payload, Post, upload } from '@vgerbot/http';
import { BaseAPIEndpoint } from '../apis/BaseAPIEndpoint';

@Endpoint({
    extends: BaseAPIEndpoint,
    path: '/upload'
})
export class UploadEndpoint {
    @Post({
        path: 'single'
    })
    uploadSingle(@Payload() files: () => FormData | null) {
        return upload(files);
    }
}
