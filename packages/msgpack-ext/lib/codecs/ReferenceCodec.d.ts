import { CodecContext } from '../core/CodecContext';
import { VgerbotExtensionCodecType } from '../core/VgerbotExtensionCodecType';
import { Reference } from '../types/Reference';
export declare class ReferenceCodec implements VgerbotExtensionCodecType {
    type: number;
    encode(input: unknown, context: CodecContext): Uint8Array | null;
    decode(data: Uint8Array, extensionType: number, context: CodecContext): Reference;
}
