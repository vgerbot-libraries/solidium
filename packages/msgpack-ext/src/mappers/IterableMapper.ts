import type { DecodeContext } from "../context/DecodeContext";
import type { EncodeContext } from "../context/EncodeContext";
import type { ObjectMapper } from "../core/ObjectMapper";
import type { ObjectPath } from "../core/ObjectPath";
import { Reference } from "../types/Reference";

export type TransformedIterable<Tag extends number = number> = {
	$: Tag;
	_: unknown[];
};

export abstract class IterableMapper<T extends Iterable<unknown>, R>
	implements ObjectMapper<T, R>
{
	abstract canTransform(object: unknown): boolean;
	abstract createNewInstance(): T;
	abstract append(target: T, value: unknown): void;
	abstract createTransformedResult(resultArray: unknown[]): R;
	abstract forEachTransformedResult(
		target: R,
		path: ObjectPath,
		callback: (item: unknown, childPath: ObjectPath) => void,
	): void;
	transform(
		object: T,
		context: EncodeContext,
		path: ObjectPath,
	): R | Reference {
		context.recording(object, path);
		const referencePath = context.getReference(object, path);
		if (referencePath) {
			return new Reference(referencePath.path);
		}
		const result: unknown[] = [];
		context.recording(object, path);
		let i = 0;
		for (const value of object) {
			const childPath = path.child(i);
			context.recording(value, childPath);
			const mapper = context.getObjectMapper(value);
			const newValue = mapper.transform(value, context, childPath);
			result.push(newValue);
			i++;
		}
		return this.createTransformedResult(result);
	}
	abstract canRevive(object: unknown): boolean;
	revive(object: R, context: DecodeContext, path: ObjectPath): T {
		const receiver = this.createNewInstance();
		context.recording(receiver, path);
		this.forEachTransformedResult(object, path, (item, path) => {
			const mapper = context.getObjectMapper(item);
			const reviveValue = mapper.revive(item, context, path);
			context.recording(reviveValue, path);
			this.append(receiver, reviveValue);
		});
		return receiver;
	}
}
