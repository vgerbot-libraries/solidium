import { ExtensionCodec, encode as msgPackEncode } from "@msgpack/msgpack";
import { ReferenceCodec } from "../codecs/ReferenceCodec";
import type { DecodeContext } from "../context/DecodeContext";
import { EncodeContext } from "../context/EncodeContext";
import type { CodecContext } from "./CodecContext";

export function encode(input: unknown) {
	const extensionCodec = new ExtensionCodec<EncodeContext | DecodeContext>();
	extensionCodec.register(new ReferenceCodec());
	const context = new EncodeContext();
	const transformed = context.transformObject(input);

	return msgPackEncode<CodecContext>(transformed, {
		context,
		extensionCodec,
	});
}
