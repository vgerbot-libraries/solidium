import { CreateResourceOptions } from '../types/CreateResourceOptions';
export declare const HTTP_PROPERTY_MARK_KEY: unique symbol;
interface HttpDecorator extends PropertyDecorator {
    <T>(options: CreateResourceOptions, parser: (blob: Blob) => Promise<T>): PropertyDecorator;
    JSON(options: CreateResourceOptions): PropertyDecorator;
    SSEJSON(options: CreateResourceOptions): PropertyDecorator;
    JSONData(options: CreateResourceOptions): PropertyDecorator;
}
export declare const Http: HttpDecorator;
export {};
