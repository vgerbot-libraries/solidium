import { CodecContext } from '../core/CodecContext';
import { ObjectPath } from '../core/ObjectPath';
import { VgerbotExtensionCodec } from '../core/VgerbotExtensionCodec';

export class EncodeContext extends CodecContext {
    private readonly objectPathMap = new Map<unknown, ObjectPath[]>();
    // private readonly codecMap = new Map<unknown, VgerbotExtensionCodecType>();
    constructor(private readonly extensionCodec: VgerbotExtensionCodec) {
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
    getReference(object: unknown) {
        const paths = this.objectPathMap.get(object);
        if (!paths) {
            return;
        }
        return paths[0];
    }
    isReference(object: unknown) {
        return this.getReference(object) !== undefined;
    }
    prepare(object: unknown) {
        const handler = this.getReferenceHandler(object);
        handler.traverse(object, this, new ObjectPath([]));
    }
    getReferenceHandler(object: unknown) {
        return this.extensionCodec.getReferenceHandler(object);
    }
}
