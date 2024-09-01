export declare const SIGNAL_MARK_KEY: unique symbol;
export interface SignalOptions {
}
export declare function Signal(_?: SignalOptions): <T>(target: Object, propertyKey: string | symbol) => void;
