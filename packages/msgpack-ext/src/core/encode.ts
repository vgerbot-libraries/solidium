import { ExtensionCodec, encode as msgPackEncode } from '@msgpack/msgpack';
import { CodecContext } from './CodecContext';
import { EncodeContext } from '../context/EncodeContext';
import { DecodeContext } from '../context/DecodeContext';
import { ReferenceCodec } from '../codecs/ReferenceCodec';
import { ObjectReferenceHandler } from '../handlers/ObjectReferenceHandler';
import { ArrayReferenceHandler } from '../handlers/ArrayReferenceHandler';

export function encode(input: unknown) {
    const extensionCodec = new ExtensionCodec<EncodeContext | DecodeContext>();
    extensionCodec.register(new ReferenceCodec());
    const context = new EncodeContext();
    context.registerReferenceHandler(new ObjectReferenceHandler());
    context.registerReferenceHandler(new ArrayReferenceHandler());
    const transformed = context.handleReference(input);

    return msgPackEncode<CodecContext>(transformed, {
        context,
        extensionCodec
    });
}
