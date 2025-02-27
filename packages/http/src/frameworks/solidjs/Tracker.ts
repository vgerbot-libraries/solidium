import { AccessorArray, createEffect, on } from 'solid-js';
import { leading, debounce } from '@solid-primitives/scheduled';
import { runWithSolidiumOwner } from '@vgerbot/solidium';

export class Tracker {
    track(args: unknown[], callback: (args: unknown[]) => void) {
        const hasAccessor = !!args.find(it => typeof it === 'function');
        if (!hasAccessor) {
            return callback(args);
        }
        runWithSolidiumOwner(this, () => {
            const trigger = leading(debounce, callback);
            createEffect(
                on(
                    args.map(it => {
                        if (typeof it === 'function') {
                            return it;
                        }
                        return () => it;
                    }) as AccessorArray<unknown>,
                    trigger
                )
            );
        });
    }
}
