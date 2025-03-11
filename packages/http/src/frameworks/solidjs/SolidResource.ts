import { Signal } from '@vgerbot/solidium';
import { Progress } from '../../progress/Progress';
import { Resource } from '../../resource/Resource';
import { ResourceExecutionState } from '../../resource/ResourceExecutionState';

/**
 * Base class for Solid.js resources that provides Signal-based reactivity
 */
export abstract class SolidResource<T, E = unknown> extends Resource<T, E> {
    @Signal()
    protected state?: ResourceExecutionState<T, E>;
}

/**
 * Base class for Solid.js resources with progress tracking
 */
export abstract class SolidProgressResource<
    T,
    E = unknown
> extends SolidResource<T, E> {
    @Signal()
    progress: Progress = new Progress(0, 0);

    protected updateProgress(progress: Progress): void {
        this.progress = progress;
    }
}
