import { Charset, CharsetEnum } from './Charset';
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

export class ContentDisposition
    implements IContentDisposition, Cloneable<ContentDisposition>
{
    filename?: string;
    name?: string;
    charset?: Charset;
    creationDate?: Date;
    modificationDate?: Date;
    readDate?: Date;
    size?: number;

    constructor(public type: string) {}

    /**
     *
     * @returns the header value for this content disposition as defined in RFC 6266.
     */
    toString(): string {
        let result = this.type;

        // Append parameters if they exist
        const parameters: string[] = [];
        if (this.filename) {
            parameters.push(
                `filename="${this.encodeHeaderValue(this.filename)}"`
            );
        }
        if (this.name) {
            parameters.push(`name="${this.encodeHeaderValue(this.name)}"`);
        }
        if (this.charset) {
            parameters.push(`charset=${this.charset}`);
        }
        if (this.creationDate) {
            parameters.push(
                `creation-date=${this.formatDateValue(this.creationDate)}`
            );
        }
        if (this.modificationDate) {
            parameters.push(
                `modification-date=${this.formatDateValue(
                    this.modificationDate
                )}`
            );
        }
        if (this.readDate) {
            parameters.push(`read-date=${this.formatDateValue(this.readDate)}`);
        }
        if (this.size) {
            parameters.push(`size=${this.size}`);
        }

        // Append parameters to the result string if they exist
        if (parameters.length > 0) {
            result += '; ' + parameters.join('; ');
        }

        return result;
    }

    private encodeHeaderValue(value: string): string {
        // Encode the value if it contains special characters
        if (/[^\w\d!#$&.+\-^_`|~]/.test(value)) {
            return encodeURIComponent(value);
        }
        return value;
    }

    private formatDateValue(value: Date): string {
        // Format the date using ISO 8601 format
        return value.toISOString();
    }

    static empty(): ContentDisposition {
        return new ContentDisposition('');
    }
    /**
     * Parse the contentDisposition string and return a ContentDisposition object
     * @param contentDisposition string
     * @returns ContentDisposition object
     */
    static parse(contentDisposition: string): ContentDisposition {
        const parts = contentDisposition.split(';');

        // The first part is the disposition type
        const type = parts[0].trim();

        // Initialize an object with the required type
        const contentDispositionObject = new ContentDisposition(type);

        // Parse the parameters
        for (let i = 1; i < parts.length; i++) {
            const parameter = parts[i].trim();
            const [name, value] = parameter.split('=');
            const trimmedValue = value.trim();

            // Check for encoding and decode if necessary
            const decodedValue =
                trimmedValue.startsWith('"') && trimmedValue.endsWith('"')
                    ? this.decodeHeaderValue(trimmedValue)
                    : trimmedValue;

            switch (name.toLowerCase()) {
                case 'filename':
                    contentDispositionObject.filename = decodedValue;
                    break;
                case 'name':
                    contentDispositionObject.name = decodedValue;
                    break;
                case 'charset':
                    contentDispositionObject.charset = decodedValue as Charset;
                    break;
                case 'creation-date':
                    contentDispositionObject.creationDate =
                        this.parseDateValue(decodedValue);
                    break;
                case 'modification-date':
                    contentDispositionObject.modificationDate =
                        this.parseDateValue(decodedValue);
                    break;
                case 'read-date':
                    contentDispositionObject.readDate =
                        this.parseDateValue(decodedValue);
                    break;
                case 'size':
                    contentDispositionObject.size = parseInt(decodedValue);
                    break;
                default:
                    // Handle other parameters as needed
                    break;
            }
        }

        return contentDispositionObject;
    }
    private static decodeHeaderValue(value: string): string {
        // Remove leading and trailing double quotes and decode the value
        return decodeURIComponent(value.slice(1, -1));
    }

    private static parseDateValue(value: string) {
        const parsedDate = Date.parse(value);
        if (isNaN(parsedDate)) {
            throw new Error('Invalid date format');
        }
        return new Date(parsedDate);
    }
    static from(options: IContentDisposition): ContentDisposition {
        const instance = new ContentDisposition(options.type);
        Object.assign(instance, options);
        return instance;
    }

    clone(): ContentDisposition {
        return ContentDisposition.from(this);
    }
}
