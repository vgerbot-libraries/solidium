import { CodecContext } from '../core/CodecContext';
import { ObjectPath } from '../core/ObjectPath';
import { ReferenceHandler } from '../core/ReferenceHandler';
export declare class EncodeContext extends CodecContext {
    private readonly objectPathMap;
    private readonly referenceHandlers;
    private readonly defaultReferenceHandler;
    constructor();
    recording(object: unknown, path: ObjectPath): void;
    isHandled(object: unknown): boolean;
    getReference(object: unknown, path: ObjectPath): ObjectPath | undefined;
    handleReference(object: unknown): unknown;
    getReferenceHandler(object: unknown): ReferenceHandler;
    registerReferenceHandler(referenceHandler: ReferenceHandler): void;
}
