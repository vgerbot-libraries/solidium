import { CodecContext } from '../core/CodecContext';
import { ObjectPath } from '../core/ObjectPath';
export declare class EncodeContext extends CodecContext {
    private readonly objectPathMap;
    constructor();
    recording(object: unknown, path: ObjectPath): void;
    isHandled(object: unknown): boolean;
    getReference(object: unknown, path: ObjectPath): ObjectPath | undefined;
    transformObject(object: unknown): unknown;
    getObjectMapper(object: unknown): import("../core/ObjectMapper").ObjectMapper<unknown, unknown>;
}
