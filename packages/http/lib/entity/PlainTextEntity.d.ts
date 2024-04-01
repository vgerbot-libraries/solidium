import { ContentType } from '../types/ContentType';
import { HttpEntity } from '../types/HttpEntity';
export declare class PlainTextEntity implements HttpEntity {
    private readonly _text;
    private _data;
    constructor(_text: string);
    contentType(): ContentType;
    data(): Promise<Blob>;
    size(): number;
    clone(): HttpEntity;
}
