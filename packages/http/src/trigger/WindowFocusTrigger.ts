import { WindowEventTrigger } from './WindowEventTrigger';

export class WindowFocusTrigger extends WindowEventTrigger {
    constructor() {
        super('focus');
    }
}
