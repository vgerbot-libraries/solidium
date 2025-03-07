import { Inject, InstanceScope, Scope } from '@vgerbot/ioc';
import { Signal } from '@vgerbot/solidium';
import { Progress } from '../../progress/Progress';
import { UploadResource } from '../../resource/UploadResource';
import { SolidReactiveState } from './SolidReactiveState';

@Scope(InstanceScope.TRANSIENT)
export class SolidjsUploadResource<
    T extends BodyInit
> extends UploadResource<T> {
    get messages(): T[] {
        return [this.data];
    }
    @Inject()
    protected state!: SolidReactiveState<T>;
    @Signal()
    progress: Progress = new Progress(0, 0);

    protected updateProgress(progress: Progress): void {
        this.progress = progress;
    }
}
