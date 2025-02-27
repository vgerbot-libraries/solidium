import { createEffect } from 'solid-js';
import { Observer } from '../../observer/Observer';

export class Tracker {
    track(args: unknown[], callback: (args: unknown[]) => void) {
        createEffect(() => {
            const unwrappedArgs = args.map(it => {
                if (it instanceof Observer) {
                    return it.get();
                }
                return it;
            });
            callback(unwrappedArgs);
        });
    }
}
