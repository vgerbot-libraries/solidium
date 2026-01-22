import type { ObjectPath } from "../core/ObjectPath";
import { isPlainObject } from "../utils/isPlainObject";
import { IterableMapper } from "./IterableMapper";

type TransformedMap = {
	$: number;
	_: [unknown, unknown][];
};

export class MapMapper extends IterableMapper<
	Map<unknown, unknown>,
	TransformedMap
> {
	canTransform(object: unknown): boolean {
		return object instanceof Map;
	}
	createNewInstance(): Map<unknown, unknown> {
		return new Map();
	}
	append(target: Map<unknown, unknown>, value: unknown[]): void {
		target.set(value[0], value[1]);
	}
	createTransformedResult(resultArray: unknown[]): TransformedMap {
		return {
			$: 2,
			_: resultArray as TransformedMap["_"],
		};
	}
	forEachTransformedResult(
		target: TransformedMap,
		path: ObjectPath,
		callback: (item: unknown, childPath: ObjectPath) => void,
	): void {
		target._.forEach((item, i) => {
			const childPath = path.child(i);
			callback(item, childPath);
		});
	}
	canRevive(object: unknown): boolean {
		return (
			isPlainObject(object) &&
			"$" in object &&
			"_" in object &&
			object.$ === 2 &&
			Array.isArray(object._)
		);
	}
}
