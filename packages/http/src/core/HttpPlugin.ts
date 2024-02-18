import { ApplicationContext } from '@vgerbot/ioc';
import { SolidiumPlugin } from '@vgerbot/solidium';

export class SolidiumHttp implements SolidiumPlugin {
    init(appCtx: ApplicationContext): void {
        // PASS
    }
    destroy(): void {
        // PASS
    }
}
