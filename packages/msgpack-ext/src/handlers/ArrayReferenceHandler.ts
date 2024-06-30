import { EncodeContext } from '../context/EncodeContext';
import { ObjectPath } from '../core/ObjectPath';
import { ReferenceHandler } from '../core/ReferenceHandler';
import { Reference } from '../types/Reference';

export class ArrayReferenceHandler implements ReferenceHandler {
    accept(object: unknown): boolean {
        return Array.isArray(object);
    }
    transform(
        object: unknown[],
        context: EncodeContext,
        path: ObjectPath
    ): unknown {
        context.recording(object, path);
        const referencePath = context.getReference(object, path);
        if (referencePath) {
            return new Reference(referencePath.path);
        }
        return object.map((it, i) => {
            const childPath = path.child(i);
            context.recording(it, childPath);
            const handler = context.getReferenceHandler(childPath);
            return handler.transform(it, context, childPath);
        });
    }
}
