import { CodecContext } from '../core/CodecContext';
import { ReferenceMapper } from '../mappers/ReferenceMapper';

export class DecodeContext extends CodecContext {
    constructor() {
        super();
        this.registerObjectMapper(new ReferenceMapper());
    }
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
