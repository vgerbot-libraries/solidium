import {
    Endpoint,
    Get,
    PathVariable,
    Payload,
    Post,
    Query,
    R,
    restfull
} from '@vgerbot/http';

export interface ObjectDef {
    id: string;
    name: string;
    data: Record<string, unknown>;
}

@Endpoint({
    baseURL: 'https://api.restful-api.dev/'
})
export class ObjectsEndpoint {
    @Get('objects')
    listAll() {
        return restfull<ObjectDef[]>();
    }
    @Get('objects/:id')
    getItem(@PathVariable('id') id: R<string>) {
        return restfull<ObjectDef>(id);
    }
    @Get('objects')
    listObjectByIds(@Query('id') ids: string[]) {
        return restfull<ObjectDef[]>(ids);
    }
    @Post('objects')
    addObject(@Payload() data: ObjectDef) {
        return restfull<ObjectDef>(data);
    }
}
