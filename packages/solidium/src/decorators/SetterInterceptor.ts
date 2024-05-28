import { MemberKey, Newable } from '@vgerbot/ioc';
import {
    SetterInterceptorOptions,
    appendSetterInterceptor
} from '../helper/appendSetterInterceptor';
import { defineMemberDecoratorProcessor } from '../core/defineMemberDecoratorProcessor';

export const SETTER_INTERCEPTOR_METHOD_MARK_KEY = Symbol(
    'solidium_setter_interceptor_method'
);

export const SetterInterceptor = (
    options: string | symbol | SetterInterceptorOptions
) => {
    switch (typeof options) {
        case 'string':
        case 'symbol':
            options = {
                key: options
            };
            break;
        default:
    }
    return defineMemberDecoratorProcessor(SETTER_INTERCEPTOR_METHOD_MARK_KEY, {
        beforeInstantiation: <T>(
            constructor: Newable<T>,
            member: MemberKey
        ) => {
            appendSetterInterceptor(
                constructor.prototype,
                options as SetterInterceptorOptions,
                member
            );
        }
    }) as MethodDecorator;
};
