import { useService } from '@vgerbot/solidium';
import { HttpClient } from '../core/HttpClient';

export function useHttpClient() {
    return useService(HttpClient);
}
