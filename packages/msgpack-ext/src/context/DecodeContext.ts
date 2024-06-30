import { CodecContext } from '../core/CodecContext';

export class DecodeContext extends CodecContext {
    revive(decoded: unknown) {
        const mapper = this.getObjectMapper(decoded);
        return mapper.revive(decoded, this, this.getRootPath());
    }
    getObjectMapper(object: unknown) {
        return (
            this.objectMappers.find(it => it.canRevive(object)) ||
            this.defaultObjectMapper
        );
    }
}
