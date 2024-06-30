import { CodecContext } from '../core/CodecContext';
import { ObjectPath } from '../core/ObjectPath';
import { ReferenceHandler } from '../core/ReferenceHandler';
import { Reference } from '../types/Reference';

export class EncodeContext extends CodecContext {
    private readonly objectPathMap = new Map<unknown, ObjectPath[]>();
    private readonly referenceHandlers: Array<ReferenceHandler> = [];
    private readonly defaultReferenceHandler: ReferenceHandler = {
        accept() {
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
    handleReference(object: unknown) {
        const handler = this.getReferenceHandler(object);
        const path = this.getRootPath();
        return handler.transform(object, this, path);
    }
    getReferenceHandler(object: unknown) {
        return (
            this.referenceHandlers.find(it => it.accept(object)) ||
            this.defaultReferenceHandler
        );
    }
    registerReferenceHandler(referenceHandler: ReferenceHandler) {
        this.referenceHandlers.push(referenceHandler);
    }
}
