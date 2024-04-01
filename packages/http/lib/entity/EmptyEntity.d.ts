import { ContentType } from '../types/ContentType';
import { HttpEntity } from '../types/HttpEntity';
export declare class EmptyEntity implements HttpEntity {
    contentType(): ContentType;
    data(): Promise<Blob>;
    size(): number;
    clone(): HttpEntity;
}
