import { Progress } from '../progress/Progress';
import { Resource } from './Resource';

export interface ProgressiveResource<T, B = unknown> extends Resource<T, B> {
    readonly progress: Progress;
}
