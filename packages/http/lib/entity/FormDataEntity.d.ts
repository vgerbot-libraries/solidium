import { ContentType } from '../types/ContentType';
import { HttpEntity } from '../types/HttpEntity';
export declare class FormDataEntity implements HttpEntity {
    private readonly formdata;
    constructor(formdata: FormData);
    contentType(): ContentType;
    data(): Promise<Blob | FormData>;
    size(): number;
    clone(): HttpEntity;
}
