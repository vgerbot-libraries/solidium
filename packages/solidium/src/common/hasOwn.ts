export function hasOwn(object: unknown, propertyKey: string | symbol) {
    return Object.prototype.hasOwnProperty.call(object, propertyKey);
}
