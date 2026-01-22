/**
 * Enumeration of built-in storage drivers available in the persistence library.
 *
 * @public
 */
export enum DefaultDrivers {
    /**
     * Uses browser's localStorage API for persistent storage across sessions.
     */
    LOCAL_STORAGE = 'localStorage',
    /**
     * Uses browser's sessionStorage API for storage that persists only for the session.
     */
    SESSION_STORAGE = 'sessionStorage',
    /**
     * Uses browser's IndexedDB API for more advanced persistent storage with larger capacity.
     */
    INDEXED_DB = 'indexedDB'
}
