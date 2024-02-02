import { Mark, MemberKey, Newable } from '@vgerbot/ioc';
import {
    MemberDecoratorProcessor,
    IS_MEMBER_DECORATOR_PROCESSOR
} from '../core/DecoratorProcessor';
import {
    SetterInterceptorOptions,
    appendSetterInterceptor
} from '../helper/appendSetterInterceptor';

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
    return Mark(SETTER_INTERCEPTOR_METHOD_MARK_KEY, {
        [IS_MEMBER_DECORATOR_PROCESSOR]: true,
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
    } as MemberDecoratorProcessor) as MethodDecorator;
};
