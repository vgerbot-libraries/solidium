import { ReferenceTransformer } from '../transformer/ReferanceTransformer';
import { ObjectPath } from './ObjectPath';
import { Transformer } from './Transformer';
import { transformerOfObject } from './TransformerRegistry';

export class SerializeContext {
    private objectPathMap = new Map<unknown, ObjectPath[]>();
    private pathObjectMap = new Map<ObjectPath, unknown>();
    private transformerMap = new Map<unknown, Transformer<unknown, unknown>>();
    isHandled(object: unknown) {
        return this.objectPathMap.has(object);
    }
    recording(object: unknown, path: ObjectPath) {
        if (object === null || object === undefined) {
            return;
        }
        switch (typeof object) {
            case 'boolean':
            case 'number':
            case 'string':
                return;
        }
        const paths = this.objectPathMap.get(object) || [];
        paths.push(path);
        this.objectPathMap.set(object, paths);
        this.pathObjectMap.set(path, object);
    }
    getObject(path: ObjectPath) {
        return this.pathObjectMap.get(path);
    }
    getReference(path: ObjectPath) {
        if (!this.pathObjectMap.has(path)) {
            return undefined;
        }
        const object = this.pathObjectMap.get(path);
        const paths = this.objectPathMap.get(object);
        if (!paths) {
            return undefined;
        }
        return paths[0] !== path ? paths[0] : undefined;
    }
    isReference(path: ObjectPath) {
        return this.getReference(path) !== undefined;
    }
    transformerOf(
        object: unknown,
        path: ObjectPath
    ): Transformer<unknown, unknown> {
        if (this.isReference(path)) {
            return new ReferenceTransformer();
        }
        let transformer = this.transformerMap.get(object);
        if (!transformer) {
            transformer = transformerOfObject(object);
        }
        this.transformerMap.set(object, transformer);
        return transformer;
    }
}
