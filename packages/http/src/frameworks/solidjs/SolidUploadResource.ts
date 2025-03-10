import { InstanceScope, Scope } from '@vgerbot/ioc';
import { Signal } from '@vgerbot/solidium';
import { Progress } from '../../progress/Progress';
import { UploadResource } from '../../resource/UploadResource';

@Scope(InstanceScope.TRANSIENT)
export class SolidUploadResource<T extends BodyInit> extends UploadResource<T> {
    @Signal()
    progress: Progress = new Progress(0, 0);

    protected updateProgress(progress: Progress): void {
        this.progress = progress;
    }
}
