import { ExtensionCodec, encode as msgPackEncode } from '@msgpack/msgpack';
import { CodecContext } from './CodecContext';
import { EncodeContext } from '../context/EncodeContext';
import { DecodeContext } from '../context/DecodeContext';
import { ReferenceCodec } from '../codecs/ReferenceCodec';
import { PlainObjectMapper } from '../mappers/PlainObjectMapper';
import { ArrayMapper } from '../mappers/ArrayMapper';

export function encode(input: unknown) {
    const extensionCodec = new ExtensionCodec<EncodeContext | DecodeContext>();
    extensionCodec.register(new ReferenceCodec());
    const context = new EncodeContext();
    context.registerObjectMapper(new PlainObjectMapper());
    context.registerObjectMapper(new ArrayMapper());
    const transformed = context.transformObject(input);

    return msgPackEncode<CodecContext>(transformed, {
        context,
        extensionCodec
    });
}
