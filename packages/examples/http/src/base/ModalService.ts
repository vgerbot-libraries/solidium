import { Defer } from '@vgerbot/http';
import { Signal, Tracker } from '@vgerbot/solidium';
import { Inject } from '@vgerbot/ioc';

const DEFER_METADATA_KEY = Symbol('defer');
export class ModalService {
    @Signal()
    tasks: Array<() => boolean> = [];
    @Inject()
    private tracker!: Tracker;

    async takeUntil(that: () => boolean) {
        await Promise.all(
            this.tasks.map(task => {
                const defer = Reflect.getMetadata(DEFER_METADATA_KEY, task);
                return defer.promise;
            })
        );
        const defer = new Defer<void>();

        Reflect.defineMetadata(DEFER_METADATA_KEY, defer, that);
        this.tasks = this.tasks.concat(that);

        this.tracker.track(dispose => {
            const isDone = that();
            if (isDone) {
                dispose();
                defer.resolve();
            }
        });

        return defer.promise;
    }
}
