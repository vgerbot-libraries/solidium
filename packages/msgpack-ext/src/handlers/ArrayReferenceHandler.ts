import { EncodeContext } from '../context/EncodeContext';
import { ObjectPath } from '../core/ObjectPath';
import { ReferenceHandler } from '../core/ReferenceHandler';
import { Reference } from '../types/Reference';

export class ArrayReferenceHandler implements ReferenceHandler {
    accept(object: unknown): boolean {
        return Array.isArray(object);
    }
    traverse(
        object: unknown[],
        context: EncodeContext,
        path: ObjectPath
    ): void {
        context.recording(object, path);
        for (let i = 0; i < object.length; i++) {
            const value = object[i];
            const childPath = path.child(i);
            if (context.isHandled(value)) {
                context.recording(object, childPath);
                continue;
            }
            const handler = context.getReferenceHandler(value);
            handler.traverse(value, context, childPath);
        }
    }
    transform(
        object: unknown[],
        context: EncodeContext,
        path: ObjectPath
    ): unknown {
        const referencePath = context.getReference(object, path);
        if (referencePath) {
            return new Reference(referencePath.path);
        }
        return object.map((it, i) => {
            const childPath = path.child(i);
            const handler = context.getReferenceHandler(childPath);
            return handler.transform(it, context, childPath);
        });
    }
}
