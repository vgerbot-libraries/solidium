import { CodecContext } from "../core/CodecContext";
import type { ObjectPath } from "../core/ObjectPath";

export class EncodeContext extends CodecContext {
	private readonly objectPathMap = new Map<unknown, ObjectPath[]>();

	recording(object: unknown, path: ObjectPath): void {
		if (object === null || object === undefined) {
			return;
		}
		switch (typeof object) {
			case "boolean":
			case "number":
			case "string":
				return;
		}
		super.recording(object, path);
		const paths = this.objectPathMap.get(object) || [];
		paths.push(path);
		this.objectPathMap.set(object, paths);
	}
	isHandled(object: unknown) {
		return this.objectPathMap.has(object);
	}
	getReference(object: unknown, path: ObjectPath) {
		const paths = this.objectPathMap.get(object);
		if (!paths) {
			return;
		}
		return paths[0] !== path ? paths[0] : undefined;
	}
	transformObject(object: unknown) {
		const mapper = this.getObjectMapper(object);
		const path = this.getRootPath();
		return mapper.transform(object, this, path);
	}
	getObjectMapper(object: unknown) {
		return (
			this.objectMappers.find((it) => it.canTransform(object)) ||
			this.defaultObjectMapper
		);
	}
}
