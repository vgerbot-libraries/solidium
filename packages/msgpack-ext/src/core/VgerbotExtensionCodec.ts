import {
    ExtensionCodec,
    ExtensionDecoderType,
    ExtensionEncoderType
} from '@msgpack/msgpack';
import { EncodeContext } from '../context/EncodeContext';
import { DecodeContext } from '../context/DecodeContext';
import { ReferenceCodec } from '../codecs/ReferenceCodec';

export class VgerbotExtensionCodec extends ExtensionCodec<
    EncodeContext | DecodeContext
> {
    private readonly referenceCodec = new ReferenceCodec();
    constructor() {
        super();
        super.register(this.referenceCodec);
    }
    register(codecType: {
        type: number;
        encode: ExtensionEncoderType<EncodeContext | DecodeContext>;
        decode: ExtensionDecoderType<EncodeContext | DecodeContext>;
    }): void {
        super.register(codecType);
    }
}
