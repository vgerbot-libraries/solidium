import { HttpResponse } from '../types/HttpResponse';

export async function internalValidateStatus(response: HttpResponse) {
    if (response.status >= 400) {
        throw new Error(response.statusText);
    }
}
