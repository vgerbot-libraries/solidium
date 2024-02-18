export const HTTP_CONFIGURER = Symbol('solidium-http-configurer');
export const HTTP_CLIENT_CONFIGURER = Symbol('solidium-http-client-configurer');
export const HTTP_CONFIGURATION = Symbol('solidium-http-configuration');

export enum CommonInterceptorNameEnum {
    CACHE = 'cache',
    LOGGING = 'logging',
    RETRY = 'retry',
    TIMEOUT = 'timeout'
}
