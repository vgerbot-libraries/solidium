import { setupWorker } from 'msw/browser';
import { authHandlers } from './auth.mock';

const worker = setupWorker(
    // @ts-ignore
    ...authHandlers
);

worker.start({});
