export function hasOwn(object: unknown, propertyKey: string | symbol) {
	if (object === null || object === undefined) {
		return false;
	}
	return Object.hasOwn(object, propertyKey);
}
