const NOT_INITIALIZED_VALUE = Symbol('NOT_INITIALIZED_VALUE');
export function lazy(): PropertyDecorator {
    return (prototype: object, propertyKey: string | symbol) => {
        const desc = Object.getOwnPropertyDescriptor(prototype, propertyKey);
        if (!desc || !desc.configurable) {
            throw new Error(
                `Cannot override property: ${String(propertyKey)}, descriptor: ${JSON.stringify(desc)}`
            );
        }
        const getter = desc.get;
        if (typeof getter !== 'function') {
            throw new Error(`Property ${String(propertyKey)} is not a getter`);
        }
        let value = NOT_INITIALIZED_VALUE;
        const descriptor = Object.assign({}, desc, {
            get() {
                if (value === NOT_INITIALIZED_VALUE) {
                    value = getter.call(this);
                }
                return value;
            }
        });
        Object.defineProperty(prototype, propertyKey, descriptor);
        return descriptor;
    };
}
