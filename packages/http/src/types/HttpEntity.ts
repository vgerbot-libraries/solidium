import { Cloneable } from './Cloneable';
import { ContentType } from './ContentType';

export interface HttpEntity extends Cloneable<HttpEntity> {
    contentType(): ContentType;
    data(): Promise<Blob | FormData | URLSearchParams | ReadableStream>;
    size(): number;
}
