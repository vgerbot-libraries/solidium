import { ExtensionCodec, ExtensionDecoderType, ExtensionEncoderType } from '@msgpack/msgpack';
import { EncodeContext } from '../context/EncodeContext';
import { DecodeContext } from '../context/DecodeContext';
export declare class VgerbotExtensionCodec extends ExtensionCodec<EncodeContext | DecodeContext> {
    private readonly referenceCodec;
    constructor();
    register(codecType: {
        type: number;
        encode: ExtensionEncoderType<EncodeContext | DecodeContext>;
        decode: ExtensionDecoderType<EncodeContext | DecodeContext>;
    }): void;
}
