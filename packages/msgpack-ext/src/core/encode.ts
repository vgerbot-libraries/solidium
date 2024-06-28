import { encode as msgPackEncode } from '@msgpack/msgpack';
import { VgerbotExtensionCodec } from './VgerbotExtensionCodec';
import { CodecContext } from './CodecContext';
import { EncodeContext } from '../context/EncodeContext';

export function encode(input: unknown) {
    const extensionCodec = new VgerbotExtensionCodec();

    const context = new EncodeContext(extensionCodec);
    context.prepare(input);

    return msgPackEncode<CodecContext>(input, {
        context,
        extensionCodec
    });
}
