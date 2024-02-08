import { Charset } from './Charset';
import { Cloneable } from './Cloneable';

export class ContentDisposition implements Cloneable<ContentDisposition> {
    filename?: string;
    name?: string;
    charset?: Charset;
    creationDate?: string;
    modificationDate?: string;
    readDate?: string;
    size?: number;

    constructor(public type: string) {
        this.type = type;
    }

    toString(): string {
        // Return the header value for this content disposition as defined in RFC 6266.
        // Implementation depends on the format specified in RFC 6266.
        // This method is not implemented here.
        return '';
    }

    static empty(): ContentDisposition {
        return new ContentDisposition('');
    }

    static parse(contentDisposition: string): ContentDisposition {
        // Parse the contentDisposition string and return a ContentDisposition object
        // TODO: Implementation depends on the parsing logic.
        // This method is not implemented here.
        return new ContentDisposition('');
    }

    clone(): ContentDisposition {
        // TODO: clone ContentDisposition
        return new ContentDisposition(this.type);
    }
}
