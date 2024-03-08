import { ContentType } from '../types/ContentType';
import { HttpEntity } from '../types/HttpEntity';

export class URLSearchParamsEntity implements HttpEntity {
    constructor(private readonly formdata: URLSearchParams) {}
    contentType(): ContentType {
        return ContentType.none();
    }
    data(): Promise<URLSearchParams> {
        return Promise.resolve(this.formdata);
    }
    size(): number {
        return -1;
    }
    clone(): HttpEntity {
        const newFormData = new URLSearchParams();
        this.formdata.forEach((value, key) => {
            this.formdata.append(key, value);
        });
        return new URLSearchParamsEntity(newFormData);
    }
}
