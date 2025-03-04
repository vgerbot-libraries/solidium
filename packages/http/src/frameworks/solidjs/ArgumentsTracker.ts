import { AccessorArray, createEffect, on } from 'solid-js';
import { leading, debounce } from '@solid-primitives/scheduled';
import { runWithSolidiumOwner } from '@vgerbot/solidium';

export class ArgumentsTracker {
    track(args: unknown[], callback: (args: unknown[]) => void) {
        const hasAccessor = !!args.find(it => typeof it === 'function');
        if (!hasAccessor) {
            return callback(args);
        }
        runWithSolidiumOwner(this, () => {
            const trigger = leading(debounce, (resolvedArgs: unknown[]) => {
                for (let i = 0; i < args.length; i++) {
                    if (typeof args[i] === 'function') {
                        if (
                            resolvedArgs[i] === null ||
                            resolvedArgs[i] === undefined
                        ) {
                            return;
                        }
                    }
                }
                callback(resolvedArgs);
            });
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
