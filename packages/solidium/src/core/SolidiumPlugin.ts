import { ApplicationContext } from '@vgerbot/ioc';

export interface SolidiumPlugin {
    init(appCtx: ApplicationContext): void;
    destroy(): void;
}
