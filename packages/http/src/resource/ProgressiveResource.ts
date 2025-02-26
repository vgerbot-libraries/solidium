import { Progress } from '../progress/Progress';
import { Resource } from './Resource';

export interface ProgressiveResource<T> extends Resource<T> {
    readonly progress: Progress;
}
