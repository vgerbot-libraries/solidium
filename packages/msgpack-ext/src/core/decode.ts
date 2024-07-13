import { ExtensionCodec, decode as msgpackDecode } from '@msgpack/msgpack';
import { DecodeContext } from '../context/DecodeContext';
import { ReferenceCodec } from '../codecs/ReferenceCodec';
import { EncodeContext } from '../context/EncodeContext';

export function decode(buffer: ArrayLike<number> | BufferSource) {
    const extensionCodec = new ExtensionCodec<EncodeContext | DecodeContext>();
    extensionCodec.register(new ReferenceCodec());
    const context = new DecodeContext();

    const decoded = msgpackDecode<EncodeContext | DecodeContext>(buffer, {
        context,
        extensionCodec
    });
    return context.revive(decoded);
}
