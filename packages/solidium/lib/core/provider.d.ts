import { ApplicationContext, Newable } from '@vgerbot/ioc';
import { ParentProps } from 'solid-js';
export declare const IoCContext: import("solid-js").Context<ApplicationContext | undefined>;
export type SolidiumProps = ParentProps<{
    init?: (appCtx: ApplicationContext) => void;
    autoRegisterClasses?: Array<Newable<unknown>>;
}>;
export declare function Solidium(props: SolidiumProps): import("solid-js").JSX.Element;
