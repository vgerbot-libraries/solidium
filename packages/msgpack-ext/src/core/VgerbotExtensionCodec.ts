import {
    ExtensionCodec,
    ExtensionDecoderType,
    ExtensionEncoderType
} from '@msgpack/msgpack';
import { EncodeContext } from '../context/EncodeContext';
import { DecodeContext } from '../context/DecodeContext';
import { VgerbotExtensionCodecType } from './VgerbotExtensionCodecType';
import { ReferenceCodec } from '../codecs/ReferenceCodec';
import { ReferenceHandler } from './ReferenceHandler';

export class VgerbotExtensionCodec extends ExtensionCodec<
    EncodeContext | DecodeContext
> {
    private readonly customCodecs: Array<VgerbotExtensionCodecType> = [];
    private readonly referenceCodec = new ReferenceCodec();
    private readonly referenceHandlers: Array<ReferenceHandler> = [];
    private readonly defaultReferenceHandler: ReferenceHandler = {
        accept() {
            return true;
        },
        traverse(object, context, path) {
            context.recording(object, path);
        }
    };
    constructor() {
        super();
        super.register(this.referenceCodec);
    }
    registerReferenceHandler(referenceHandler: ReferenceHandler) {
        this.referenceHandlers.push(referenceHandler);
    }
    getReferenceHandler(object: unknown) {
        return (
            this.referenceHandlers.find(it => it.accept(object)) ||
            this.defaultReferenceHandler
        );
    }
    register(codecType: {
        type: number;
        encode: ExtensionEncoderType<EncodeContext | DecodeContext>;
        decode: ExtensionDecoderType<EncodeContext | DecodeContext>;
    }): void {
        super.register(codecType);
        if ('referenceHandler' in codecType) {
            this.registerReferenceHandler(
                codecType.referenceHandler as ReferenceHandler
            );
        }
    }
    getReferenceCodec() {
        return this.referenceCodec;
    }
    getCustomCodecByObject(object: unknown) {
        return this.customCodecs.find(it => it.accept(object));
    }
}
