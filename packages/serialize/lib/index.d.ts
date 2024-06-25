import './transformer';
export interface SerializeOptions {
    circular?: boolean;
}
export declare function serialize(object: unknown, options?: SerializeOptions): Promise<Uint8Array>;
export declare function deserialize(data: Uint8Array): unknown;
