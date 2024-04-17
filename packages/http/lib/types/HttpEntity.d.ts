import { Cloneable } from './Cloneable';
import { ContentType } from './ContentType';
import { HttpBody } from './HttpBody';
export interface HttpEntity extends Cloneable<HttpEntity> {
    contentType(): ContentType;
    data(): Promise<HttpBody>;
    size(): number;
}
