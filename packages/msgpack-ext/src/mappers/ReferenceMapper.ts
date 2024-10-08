import { DecodeContext } from '../context/DecodeContext';
import { ObjectMapper } from '../core/ObjectMapper';
import { Reference } from '../types/Reference';

export class ReferenceMapper implements ObjectMapper<unknown, Reference> {
    canTransform(): boolean {
        return false;
    }
    transform(): Reference {
        throw new Error('Method not implemented.');
    }
    canRevive(object: unknown): boolean {
        return object instanceof Reference;
    }
    revive(object: Reference, context: DecodeContext): unknown {
        const root = context.getRootPath();
        const referenceToPath = root.descendant(object.path);
        return context.getObject(referenceToPath);
    }
}
