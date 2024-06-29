import { ObjectPath } from './ObjectPath';
export declare abstract class CodecContext {
    protected readonly pathObjectMap: Map<ObjectPath, unknown>;
    private readonly rootPath;
    recording(object: unknown, path: ObjectPath): void;
    getObject(path: ObjectPath): unknown;
    getRootPath(): ObjectPath;
}
