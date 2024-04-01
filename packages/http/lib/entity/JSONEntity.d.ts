import { ContentType } from '../types/ContentType';
import { HttpEntity } from '../types/HttpEntity';
export declare class JSONEntity implements HttpEntity {
    private _getJson;
    private jsonPromise;
    private jsonObjectPromise;
    constructor(_getJson: () => Promise<string>);
    contentType(): ContentType;
    data(): Promise<Blob>;
    parsed<T>(): Promise<T>;
    size(): number;
    clone(): HttpEntity;
}
