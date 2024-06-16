import { Data } from '../types/Data';

export interface Storage {
    observe(key: string, onChange: (newValue: unknown) => void): () => void;
    setItem(key: string, value: Data): Promise<void>;
    getItem(key: string): Promise<Data>;
    value(key: string): PropertyDecorator;
}
