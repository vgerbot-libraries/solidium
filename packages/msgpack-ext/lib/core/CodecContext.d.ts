import { ObjectMapper } from './ObjectMapper';
import { ObjectPath } from './ObjectPath';
export declare abstract class CodecContext {
    protected readonly pathObjectMap: Map<ObjectPath, unknown>;
    private readonly rootPath;
    protected readonly objectMappers: Array<ObjectMapper>;
    protected readonly defaultObjectMapper: ObjectMapper;
    recording(object: unknown, path: ObjectPath): void;
    getObject(path: ObjectPath): unknown;
    getRootPath(): ObjectPath;
    registerObjectMapper(objectMapper: ObjectMapper): void;
    abstract getObjectMapper(object: unknown): ObjectMapper;
}
