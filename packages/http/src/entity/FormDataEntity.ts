import { ContentType } from '../types/ContentType';
import { HttpEntity } from '../types/HttpEntity';

export class FormDataEntity implements HttpEntity {
    constructor(private readonly formdata: FormData) {}
    contentType(): ContentType {
        return ContentType.none();
    }
    data(): Promise<Blob | FormData> {
        return Promise.resolve(this.formdata);
    }
    size(): number {
        return -1;
    }
    clone(): HttpEntity {
        const newFormData = new FormData();
        this.formdata.forEach((value, key) => {
            this.formdata.append(key, value);
        });
        return new FormDataEntity(newFormData);
    }
}
