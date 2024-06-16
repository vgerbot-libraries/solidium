import { Data } from '../types/Data';
import { Storage } from './Storage';

export class StorageImpl implements Storage {
    observe(key: string, onChange: (newValue: unknown) => void): () => void {
        throw new Error('Method not implemented.');
    }
    setItem(key: string, value: Data): Promise<void> {
        throw new Error('Method not implemented.');
    }
    getItem(key: string): Promise<Data> {
        throw new Error('Method not implemented.');
    }
    value(key: string): PropertyDecorator {
        throw new Error('Method not implemented.');
    }
}
