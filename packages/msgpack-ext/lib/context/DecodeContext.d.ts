import { CodecContext } from '../core/CodecContext';
export declare class DecodeContext extends CodecContext {
    constructor();
    revive(decoded: unknown): unknown;
    getObjectMapper(object: unknown): import("../core/ObjectMapper").ObjectMapper<unknown, unknown>;
}
