import type {
	ExtensionDecoderType,
	ExtensionEncoderType,
} from "@msgpack/msgpack";
import type { DecodeContext } from "../context/DecodeContext";
import type { EncodeContext } from "../context/EncodeContext";

export interface VgerbotExtensionCodecType {
	type: number; // must be in range of 0~127
	encode: ExtensionEncoderType<EncodeContext>;
	decode: ExtensionDecoderType<DecodeContext>;
}
