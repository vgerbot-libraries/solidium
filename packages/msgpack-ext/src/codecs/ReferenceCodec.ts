import { CodecContext } from '../core/CodecContext';
import { Types } from '../core/Types';
import { VgerbotExtensionCodecType } from '../core/VgerbotExtensionCodecType';

export class ReferenceCodec implements VgerbotExtensionCodecType {
    type: number = Types.Reference;
    accept(): boolean {
        return false;
    }
    preEncode(): void {
        // IGNORE
    }
    encode(input: unknown, context: CodecContext): Uint8Array | null {
        return null;
    }
    decode(data: Uint8Array, extensionType: number, context: CodecContext) {
        //
    }
}
