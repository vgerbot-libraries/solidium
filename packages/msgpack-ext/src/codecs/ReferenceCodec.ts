import { decode, encode } from '@msgpack/msgpack';
import { CodecContext } from '../core/CodecContext';
import { Types } from '../core/Types';
import { VgerbotExtensionCodecType } from '../core/VgerbotExtensionCodecType';
import { Reference } from '../types/Reference';

export class ReferenceCodec implements VgerbotExtensionCodecType {
    type: number = Types.Reference;
    encode(input: unknown, context: CodecContext): Uint8Array | null {
        if (input instanceof Reference) {
            return encode(input.path);
        }
        return null;
    }
    decode(data: Uint8Array, extensionType: number, context: CodecContext) {
        const result = decode(data) as string[];
        return new Reference(result);
    }
}
