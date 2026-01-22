import { EndpointMetadata } from "../metadata/EndpointMetadata";
import { EXTRA_METADATA_SWR_KEYGEN } from "./consts";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function Key(key: string | ((...args: any[]) => string)) {
	return (
		target: object,
		propertyKey: ClassMethodDecoratorContext | string | symbol,
	) => {
		const methodName =
			typeof propertyKey === "object" ? propertyKey.name : propertyKey;
		const methodMetadata = EndpointMetadata.from(
			target.constructor,
		).getMethodMetadata(methodName);
		methodMetadata.setExtra(EXTRA_METADATA_SWR_KEYGEN, key);
	};
}
