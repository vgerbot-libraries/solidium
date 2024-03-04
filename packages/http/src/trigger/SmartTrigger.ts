import { HttpRequestTrigger } from '../types/HttpRequestTrigger';
import { HttpRequestTriggerOptions } from '../types/HttpRequestTriggerOptions';
import { ImmediateTrigger } from './ImmediateTrigger';
import { TimmerTrigger } from './TimmerTrigger';
import { WindowFocusTrigger } from './WindowFocusTrigger';
import { OnOnlineTrigger } from './OnOnlineTrigger';
import { IdleTrigger } from './IdleTrigger';

export class SmartTrigger implements HttpRequestTrigger {
    private triggers: HttpRequestTrigger[] = [];
    constructor({
        immediate,
        idle,
        interval,
        onFocus,
        onOnline
    }: HttpRequestTriggerOptions) {
        if (idle) {
            this.triggers.push(new IdleTrigger());
        } else if (immediate) {
            this.triggers.push(new ImmediateTrigger());
        }
        if (typeof interval === 'number' && interval > 0) {
            this.triggers.push(new TimmerTrigger(interval));
        }
        if (onFocus) {
            this.triggers.push(new WindowFocusTrigger());
        }
        if (onOnline) {
            this.triggers.push(new OnOnlineTrigger());
        }
    }
    start(requestTrigger: () => Promise<void>): void {
        let promise: undefined | Promise<void>;
        async function ensureSingleTrigger() {
            if (!!promise) {
                return;
            }
            promise = requestTrigger().finally(() => {
                promise = undefined;
            });
        }
        this.triggers.forEach(trigger => trigger.start(ensureSingleTrigger));
    }
    stop(): void {
        this.triggers.forEach(trigger => trigger.stop());
    }
}
