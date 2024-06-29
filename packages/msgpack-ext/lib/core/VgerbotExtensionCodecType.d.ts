import { ExtensionDecoderType, ExtensionEncoderType } from '@msgpack/msgpack';
import { EncodeContext } from '../context/EncodeContext';
import { DecodeContext } from '../context/DecodeContext';
export interface VgerbotExtensionCodecType {
    type: number;
    encode: ExtensionEncoderType<EncodeContext>;
    decode: ExtensionDecoderType<DecodeContext>;
}
