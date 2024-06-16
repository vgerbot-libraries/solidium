import { keep } from './keep';

export function istatic<T>() {
    return (constructor: T) => {
        keep(constructor);
    };
}
