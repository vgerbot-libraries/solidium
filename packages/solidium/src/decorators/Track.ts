import { Mark } from '@vgerbot/ioc';

export const TRACK_METHOD_MARK_KEY = Symbol('solidium_track_method');

export function Track<T>(fn: (this: T) => unknown) {
    return Mark(TRACK_METHOD_MARK_KEY, fn) as MethodDecorator;
}
