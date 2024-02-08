import { Cloneable } from './Cloneable';
import { ContentType } from './ContentType';

export interface HttpEntity extends Cloneable<HttpEntity> {
    contentType(): ContentType;
    data(): Promise<Blob>;
    stream(): ReadableStream;
    json<T>(): Promise<T>;
    size(): number;
}
