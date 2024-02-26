import { ContentType } from '../types/ContentType';
import { HttpEntity } from '../types/HttpEntity';

export class EmptyEntity implements HttpEntity {
    contentType(): ContentType {
        return ContentType.none();
    }
    data(): Promise<Blob> {
        return Promise.resolve(new Blob([]));
    }
    size(): number {
        return 0;
    }
    clone(): HttpEntity {
        return new EmptyEntity();
    }
}
