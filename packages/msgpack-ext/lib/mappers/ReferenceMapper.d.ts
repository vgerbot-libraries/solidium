import { DecodeContext } from '../context/DecodeContext';
import { ObjectMapper } from '../core/ObjectMapper';
import { Reference } from '../types/Reference';
export declare class ReferenceMapper implements ObjectMapper<unknown, Reference> {
    canTransform(): boolean;
    transform(): Reference;
    canRevive(object: Reference): boolean;
    revive(object: Reference, context: DecodeContext): unknown;
}
