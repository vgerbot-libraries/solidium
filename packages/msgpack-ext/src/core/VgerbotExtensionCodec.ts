import {
	ExtensionCodec,
	type ExtensionDecoderType,
	type ExtensionEncoderType,
} from "@msgpack/msgpack";
import { ReferenceCodec } from "../codecs/ReferenceCodec";
import type { DecodeContext } from "../context/DecodeContext";
import type { EncodeContext } from "../context/EncodeContext";

export class VgerbotExtensionCodec extends ExtensionCodec<
	EncodeContext | DecodeContext
> {
	private readonly referenceCodec = new ReferenceCodec();
	constructor() {
		super();
		super.register(this.referenceCodec);
	}
	register(codecType: {
		type: number;
		encode: ExtensionEncoderType<EncodeContext | DecodeContext>;
		decode: ExtensionDecoderType<EncodeContext | DecodeContext>;
	}): void {
		super.register(codecType);
	}
}
