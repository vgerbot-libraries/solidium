import { GetInstanceOptions, InstanceResolution, SaveInstanceOptions } from '@vgerbot/ioc';
export declare class ChildScopedInstanceResolution implements InstanceResolution {
    shouldGenerate<T, Owner>(options: GetInstanceOptions<T, Owner>): boolean;
    saveInstance<T, Owner>(options: SaveInstanceOptions<T, Owner>): void;
    getInstance<T, Owner>(options: GetInstanceOptions<T, Owner>): T | undefined;
    destroy(): void;
}
