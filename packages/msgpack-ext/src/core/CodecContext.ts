import { Reference } from '../types/Reference';
import { ObjectMapper } from './ObjectMapper';
import { ObjectPath } from './ObjectPath';

export abstract class CodecContext {
    protected readonly pathObjectMap = new Map<ObjectPath, unknown>();
    private readonly rootPath = new ObjectPath([]);
    protected readonly objectMappers: Array<ObjectMapper> = [];
    protected readonly defaultObjectMapper: ObjectMapper = {
        canTransform() {
            return true;
        },
        transform(object, context, path) {
            context.recording(object, path);
            const referencePath = context.getReference(object, path);
            if (referencePath) {
                return new Reference(path.path);
            }
            return object;
        },
        canRevive() {
            return true;
        },
        revive(object) {
            return object;
        }
    };
    recording(object: unknown, path: ObjectPath): void {
        this.pathObjectMap.set(path, object);
    }
    getObject(path: ObjectPath) {
        return this.pathObjectMap.get(path);
    }
    getRootPath() {
        return this.rootPath;
    }
    registerObjectMapper(objectMapper: ObjectMapper) {
        this.objectMappers.push(objectMapper);
    }
    abstract getObjectMapper(object: unknown): ObjectMapper;
}
