import { MemberKey } from '@vgerbot/ioc';
import { defineMemberDecoratorProcessor } from '@vgerbot/solidium';
import { useData, useJSON } from '../hooks';
import { CreateResourceOptions } from '../types/CreateResourceOptions';
import { useSSE } from '../hooks/useSSE';
import { DataResource } from '../resource/DataResource';

export const HTTP_PROPERTY_MARK_KEY = Symbol('solidium-http-mark-key');

interface HttpDecorator extends PropertyDecorator {
    <T>(
        options: CreateResourceOptions,
        parser: (blob: Blob) => Promise<T>
    ): PropertyDecorator;
    JSON(options: CreateResourceOptions): PropertyDecorator;
    SSE(
        options: CreateResourceOptions,
        chunkParser?: (chunk: string) => unknown
    ): PropertyDecorator;
    JSONData(options: CreateResourceOptions): PropertyDecorator;
}

function defineHttpDecorator(
    afterInstantiation: (
        instance: Record<MemberKey, unknown>,
        member: MemberKey
    ) => void
) {
    return defineMemberDecoratorProcessor<Record<MemberKey, unknown>>(
        HTTP_PROPERTY_MARK_KEY,
        {
            afterInstantiation(instance, member) {
                afterInstantiation(instance, member);
                return instance;
            }
        }
    );
}

export const Http = (<T>(
    options: CreateResourceOptions,
    parser: (blob: Blob) => Promise<T>
) =>
    defineHttpDecorator((instance, member) => {
        instance[member] = useData(options, parser);
    })) as unknown as HttpDecorator;

Http.JSON = (options: CreateResourceOptions) =>
    defineHttpDecorator((instance, member) => {
        instance[member] = useJSON(options);
    });

Http.JSONData = (options: CreateResourceOptions) =>
    defineHttpDecorator((instance, member) => {
        const resource = useJSON(options);
        Object.defineProperty(instance, member, {
            get: () => resource.data
        });
    });

Http.SSE = (
    options: CreateResourceOptions,
    chunkParser: (chunk: string) => unknown = chunk => JSON.parse(chunk)
) =>
    defineHttpDecorator((instance, member) => {
        instance[member] = useSSE(options, chunkParser);
    });
