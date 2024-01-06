import { Mark } from '@vgerbot/ioc';

export const SIGNAL_MARK_KEY = Symbol('solidium_mark_as_signal_property');
export const OBSERVE_PROPERTY_MARK_KEY = Symbol('solidium_observed_property');
export const SETTER_INTERCEPTOR_METHOD_MARK_KEY = Symbol(
    'solidium_setter_interceptor_method'
);
export const COMPUTED_GETTER_MARK_KEY = Symbol('solidum_computed_getter');
export const TRACK_METHOD_MARK_KEY = Symbol('solidum_track_method');

export const Signal = Mark(SIGNAL_MARK_KEY, true) as PropertyDecorator;

export type ObserveOptions = {
    collectOnce?: boolean;
};

export const Observe = (options: ObserveOptions = { collectOnce: false }) =>
    Mark(OBSERVE_PROPERTY_MARK_KEY, options) as MethodDecorator;

export type SetterInterceptorOptions = {
    key: string | symbol;
};

export const SetterInterceptor = (
    options: string | symbol | SetterInterceptorOptions
) => Mark(SETTER_INTERCEPTOR_METHOD_MARK_KEY, options) as MethodDecorator;

export const Computed = Mark(COMPUTED_GETTER_MARK_KEY) as PropertyDecorator;

export const Track = (fn: <T>(this: T) => any) =>
    Mark(TRACK_METHOD_MARK_KEY, fn) as MethodDecorator;
