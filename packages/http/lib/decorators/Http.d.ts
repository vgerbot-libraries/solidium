import { CreateResourceOptions } from '../types/CreateResourceOptions';
export declare const HTTP_PROPERTY_MARK_KEY: unique symbol;
interface HttpDecorator extends PropertyDecorator {
    <T>(options: CreateResourceOptions, parser: (blob: Blob) => Promise<T>): PropertyDecorator;
    JSON(options: CreateResourceOptions): PropertyDecorator;
    SSE(options: CreateResourceOptions, chunkParser?: (chunk: string) => unknown): PropertyDecorator;
    JSONData(options: CreateResourceOptions): PropertyDecorator;
}
export declare const Http: HttpDecorator;
export {};
