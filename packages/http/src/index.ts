// @ts-nocheck
import {
    Endpoint,
    restful,
    RequestInterceptor,
    axiosRequestAdapter,
    Get,
    Post,
    Delete,
    Cache,
    Invalidate,
    InvalidateAll,
    Query,
    Path,
    Progress,
    Body,
    Sse,
    sse,
    ProgressiveResponse,
    RestfulResponse,
    SSEResponse
} from '@vgerbot/solidium-http';

import { Inject } from '@vgerbot/ioc';

import { Track } from '@vgerbot/solidium';
import { Storage } from '@vgerbot/persistence';

// interface BaseResponse<Data, Error> {
//     data: Data;
//     error: Error;
//     pending: boolean;
//     aborted: boolean;
//     success: boolean;
//     onSuccess(
//         callback: (response: BaseResponse<Data, Error>) => void
//     ): BaseResponse<Data, Error>;
//     onFailure(
//         callback: (response: BaseResponse<Data, Error>) => void
//     ): BaseResponse<Data, Error>;
//     onComplete(
//         callback: (response: BaseResponse<Data, Error>) => void
//     ): BaseResponse<Data, Error>;
//     abort(): void;
//     execute(): void;
// }

// interface RestfulResponse<Data, Error> extends BaseResponse {
//     onSuccess(
//         callback: (response: RestfulResponse<Data, Error>) => void
//     ): RestfulResponse<Data, Error>;
//     onFailure(
//         callback: (response: RestfulResponse<Data, Error>) => void
//     ): RestfulResponse<Data, Error>;
//     onComplete(
//         callback: (response: RestfulResponse<Data, Error>) => void
//     ): RestfulResponse<Data, Error>;
// }
// interface ProgressiveResponse<Data, Error> extends BaseResponse {
//     onProgress(progressListener: (event: ProgressEvent) => void);
// }

// type JSONData = Record<string, unknown>;
// function restful<Data = JSONData, Error = Error>(): RestfulResponse<
//     Data,
//     Error
// > {
//     // TODO:
// }

@Endpoint({
    baseURL: 'https://api.alovajs.dev',
    timeout: 2000,
    requestAdaptor: axiosRequestAdapter()
})
class BaseAPIEndpoint {}
@Endpoint({
    extends: BaseAPIEndpoint,
    interceptors: [AuthInterceptor]
})
class NeedAuthAPIEndpoint {}

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
        return restful<{ token: string }, { code: string; message: string }>(
            ...arguments
        ).onSuccess(result => {
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
    extends: NeedAuthAPIEndpoint
})
class TODOAPIService {
    @Get('/todo/list')
    @Cache()
    getTodoList(
        @Query('pageIndex') pageIndex: number,
        @Query('pageSize') pageSize: number
    ): RestfulResponse {
        return restful(...arguments);
    }
    @Get('/todo/item/:id')
    getTodoItem(@Path('id') id: string) {
        return restful(...arguments);
    }

    @Delete('/todo/delete/:id')
    @InvalidateAll() // invalidate all GET request in TODOAPIService
    deleteTodoItem(@Path('id') id: string) {
        return restful(...arguments);
    }
    @Post('/todo/add')
    @Invalidate('getTodoList') // invalidate getTodoList only
    addTodoItem(@Body body: TodoItem) {
        return restful(...arguments);
    }
}
@Endpoint({
    baseUrl: 'https://oss.your-domain.com',
    interceptors: [AuthInterceptor]
})
class AttachmentService {
    @Post('/upload')
    upload(
        @Body file: File,
        @Progress() progress: ProgressEventListener
    ): ProgressiveResponse {
        return upload(...arguments);
    }
    uploadFile(
        @Multipart('file') file: File,
        @Progress() progress: ProgressEventListener
    ): ProgressiveResponse {
        return upload(...arguments);
    }
    @Get('/download/:filename')
    download(
        @Path('filename') filename: string,
        @Progress() progress: ProgressEventListener
    ): ProgressiveResponse {
        return download(...arguments);
    }
}

@Endpoint({
    extends: NeedAuthAPIEndpoint,
    basePath: '/ai'
})
class AIService {
    @Sse('chat')
    chat(
        @Body('conversationId') conversationId: string,
        @Body('message') message: string
    ): SSEResponse {
        return sse(...arguments);
    }
    @Post('conversation/create')
    createConversation(@Body('message') message: string) {
        return restful(...arguments);
    }
    @Get('conversation/list')
    getConversationList() {
        return restful(...arguments);
    }
    @Get('conversation/:id')
    getConversation(@Path('id') id: string) {
        return restful(...arguments);
    }
}
