import { Charset } from './Charset';
import { Cloneable } from './Cloneable';
interface IContentDisposition {
    type: string;
    filename?: string;
    name?: string;
    charset?: Charset;
    creationDate?: Date;
    modificationDate?: Date;
    readDate?: Date;
    size?: number;
}
export declare class ContentDisposition implements IContentDisposition, Cloneable<ContentDisposition> {
    type: string;
    filename?: string;
    name?: string;
    charset?: Charset;
    creationDate?: Date;
    modificationDate?: Date;
    readDate?: Date;
    size?: number;
    constructor(type: string);
    /**
     *
     * @returns the header value for this content disposition as defined in RFC 6266.
     */
    toString(): string;
    private encodeHeaderValue;
    private formatDateValue;
    static empty(): ContentDisposition;
    /**
     * Parse the contentDisposition string and return a ContentDisposition object
     * @param contentDisposition string
     * @returns ContentDisposition object
     */
    static parse(contentDisposition: string): ContentDisposition;
    private static decodeHeaderValue;
    private static parseDateValue;
    static from(options: IContentDisposition): ContentDisposition;
    clone(): ContentDisposition;
}
export {};
