import type { ObjectPath } from "../core/ObjectPath";
import { isPlainObject } from "../utils/isPlainObject";
import { IterableMapper } from "./IterableMapper";

type TransformedSet = {
	$: 1;
	_: unknown[];
};

export class SetMapper extends IterableMapper<Set<unknown>, TransformedSet> {
	createTransformedResult(resultArray: unknown[]): TransformedSet {
		return {
			$: 1,
			_: resultArray,
		};
	}
	forEachTransformedResult(
		target: TransformedSet,
		path: ObjectPath,
		callback: (item: unknown, childPath: ObjectPath) => void,
	): void {
		target._.forEach((item, i) => {
			callback(item, path.child(i));
		});
	}
	canRevive(object: unknown): boolean {
		return (
			isPlainObject(object) &&
			"$" in object &&
			"_" in object &&
			object.$ === 1 &&
			Array.isArray(object._)
		);
	}
	append(target: Set<unknown>, value: unknown): void {
		target.add(value);
	}
	canTransform(object: unknown): boolean {
		return object instanceof Set;
	}
	createNewInstance(): Set<unknown> {
		return new Set();
	}
}
