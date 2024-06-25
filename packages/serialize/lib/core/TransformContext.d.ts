import { ObjectPath } from './ObjectPath';
import { Transformer } from './Transformer';
export declare class EncodeContext {
    private objectPathMap;
    private pathObjectMap;
    private transformerMap;
    isHandled(object: unknown): boolean;
    recording(object: unknown, path: ObjectPath): void;
    getObject(path: ObjectPath): unknown;
    getReference(object: unknown): ObjectPath | undefined;
    isReference(object: unknown): boolean;
    transformerOf(object: unknown): Transformer<unknown, unknown>;
}
