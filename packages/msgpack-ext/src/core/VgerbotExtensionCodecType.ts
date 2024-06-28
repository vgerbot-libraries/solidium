import { ExtensionDecoderType, ExtensionEncoderType } from '@msgpack/msgpack';
import { EncodeContext } from '../context/EncodeContext';
import { DecodeContext } from '../context/DecodeContext';
import { ReferenceHandler } from './ReferenceHandler';

export interface VgerbotExtensionCodecType {
    type: number; // must be in range of 0~127
    referenceHandler?: ReferenceHandler;
    accept(input: unknown): boolean;
    encode: ExtensionEncoderType<EncodeContext>;
    decode: ExtensionDecoderType<DecodeContext>;
}
