import { ExtensionCodec, decode as msgpackDecode } from '@msgpack/msgpack';
import { DecodeContext } from '../context/DecodeContext';
import { ReferenceCodec } from '../codecs/ReferenceCodec';
import { EncodeContext } from '../context/EncodeContext';
import { PlainObjectMapper } from '../handlers/PlainObjectMapper';
import { ArrayMapper } from '../handlers/ArrayMapper';
import { ReferenceMapper } from '../handlers/ReferenceMapper';

export function decode(buffer: ArrayLike<number> | BufferSource) {
    const extensionCodec = new ExtensionCodec<EncodeContext | DecodeContext>();
    extensionCodec.register(new ReferenceCodec());
    const context = new DecodeContext();
    context.registerObjectMapper(new PlainObjectMapper());
    context.registerObjectMapper(new ArrayMapper());
    context.registerObjectMapper(new ReferenceMapper());

    const decoded = msgpackDecode<EncodeContext | DecodeContext>(buffer, {
        context,
        extensionCodec
    });
    return context.revive(decoded);
}
