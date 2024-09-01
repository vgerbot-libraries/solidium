import { Data } from '../../types/Data';
import { BucketConfiguration } from './BucketConfiguration';
import { ChangeEvent } from './ChangeEvent';
declare const PREPARE: unique symbol;
export declare class Bucket {
    private readonly name;
    private readonly driver;
    private readonly serializer;
    constructor(config: BucketConfiguration);
    [PREPARE](): Promise<void>;
    observe(key: string, onChange: (event: ChangeEvent) => void): () => void;
    setItem(key: string, value: Data): Promise<void>;
    getItem(key: string): Promise<Data | undefined>;
    clear(): Promise<void>;
    value(key: string): PropertyDecorator;
}
export {};
