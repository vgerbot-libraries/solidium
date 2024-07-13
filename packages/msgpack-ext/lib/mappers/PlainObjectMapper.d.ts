import { EncodeContext } from '../context/EncodeContext';
import { ObjectPath } from '../core/ObjectPath';
import { ObjectMapper } from '../core/ObjectMapper';
import { Reference } from '../types/Reference';
import { DecodeContext } from '../context/DecodeContext';
export declare class PlainObjectMapper implements ObjectMapper<Record<string, unknown>> {
    canTransform(object: unknown): boolean;
    transform(object: Record<string, unknown>, context: EncodeContext, path: ObjectPath): Record<string, unknown> | Reference;
    canRevive(object: unknown): boolean;
    revive(object: Record<string, unknown>, context: DecodeContext, path: ObjectPath): Record<string, unknown>;
    private map;
}
