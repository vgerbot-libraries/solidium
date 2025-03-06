import { Owner, runWithOwner } from 'solid-js';

const SOLIDIUM_SOLID_OWNER_PROPERTY_KEY = Symbol(
    'solidium-solid-owner-property'
);
export function runWithSolidiumOwner<T>(instance: object, callback: () => T) {
    const owner = Reflect.get(instance, SOLIDIUM_SOLID_OWNER_PROPERTY_KEY);
    return runWithOwner(owner, callback) as T;
}
export function setupOwner(instance: object, owner: Owner) {
    Reflect.set(instance, SOLIDIUM_SOLID_OWNER_PROPERTY_KEY, owner);
}
