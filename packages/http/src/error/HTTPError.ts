import { HttpRequest } from '../types/HttpRequest';
import { HttpResponse } from '../types/HttpResponse';

export class HTTPError {
    constructor(
        public readonly message: string,
        public readonly request: HttpRequest,
        public readonly response: HttpResponse | undefined,
        public readonly reason: Error | undefined
    ) {}

    public async toJSON<T>(): Promise<T | undefined> {
        const text = await this.toText();
        if (!text) {
            return;
        }
        return JSON.parse(text) as T;
    }

    public async toText(): Promise<string | undefined> {
        if (!this.response) {
            return;
        }
        const blob = await this.response.body();
        return await blob.text();
    }
}
