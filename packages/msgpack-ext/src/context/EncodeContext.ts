import { CodecContext } from '../core/CodecContext';
import { ObjectPath } from '../core/ObjectPath';
import { ObjectMapper } from '../core/ObjectMapper';
import { Reference } from '../types/Reference';

export class EncodeContext extends CodecContext {
    private readonly objectPathMap = new Map<unknown, ObjectPath[]>();
    private readonly objectMappers: Array<ObjectMapper> = [];
    private readonly defaultObjectMapper: ObjectMapper = {
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
        }
    };

    constructor() {
        super();
    }

    recording(object: unknown, path: ObjectPath): void {
        if (object === null || object === undefined) {
            return;
        }
        switch (typeof object) {
            case 'boolean':
            case 'number':
            case 'string':
                return;
        }
        super.recording(object, path);
        const paths = this.objectPathMap.get(object) || [];
        paths.push(path);
        this.objectPathMap.set(object, paths);
    }
    isHandled(object: unknown) {
        return this.objectPathMap.has(object);
    }
    getReference(object: unknown, path: ObjectPath) {
        const paths = this.objectPathMap.get(object);
        if (!paths) {
            return;
        }
        return paths[0] !== path ? paths[0] : undefined;
    }
    transformObject(object: unknown) {
        const handler = this.getObjectMapper(object);
        const path = this.getRootPath();
        return handler.transform(object, this, path);
    }
    getObjectMapper(object: unknown) {
        return (
            this.objectMappers.find(it => it.canTransform(object)) ||
            this.defaultObjectMapper
        );
    }
    registerObjectMapper(objectMapper: ObjectMapper) {
        this.objectMappers.push(objectMapper);
    }
}
