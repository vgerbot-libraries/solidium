import { EncodeContext } from '../context/EncodeContext';
import { ObjectPath } from '../core/ObjectPath';
import { ReferenceHandler } from '../core/ReferenceHandler';

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
            const handler = context.getReferenceHandler(value);
            handler.traverse(value, context, childPath);
        }
    }
}
