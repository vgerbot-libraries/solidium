import { ContentType } from '../types/ContentType';
import { HttpEntity } from '../types/HttpEntity';
export declare class OctetStreamEntity implements HttpEntity {
    private _getData;
    private _size;
    private dataPromise;
    constructor(_getData: () => Promise<Blob | ReadableStream>, _size: number);
    contentType(): ContentType;
    data(): Promise<Blob | ReadableStream>;
    size(): number;
    clone(): HttpEntity;
}
