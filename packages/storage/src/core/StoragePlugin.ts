import { Factory, Inject, PostInject } from '@vgerbot/ioc';
import { StorageConfiguration } from './StorageConfiguration';
import { DEFAULT_STORAGE, DEFAULT_STORAGE_CONFIGURATION } from './constants';
import { keep } from '../common/keep';
/**
 * ```jsx
 * <Solidium autoRegisterClasses={[
    StoragePlugin.default({
        // default storage configuration
    }),
    StoragePlugin.storage(
        'custom-storage-name',
        {
            // custom storage configuration
        }
    )
 ]}></Solidium>
 * ```
 * 
 * ```js
 class BizService {
    @Signal
    @StorageValue() // use default storage
    autoSaveToDefaultStorage: boolean;
    @Signal
    @StorageValue({
        store: 'custom-storage-name'
    }) // 
    autoSaveToCustomStorage: boolean;
 }
 * ```
 */
export class StoragePlugin {
    static default(configuration: StorageConfiguration) {
        class StorageConfigurationFactory {
            @Factory(DEFAULT_STORAGE_CONFIGURATION)
            getConfiguration() {
                return configuration;
            }
        }
        keep(StorageConfigurationFactory);
        return StoragePlugin;
    }
    static storage(name: string, configuration: StorageConfiguration) {
        class StorageFactory {
            @Factory(name)
            createStorage() {
                return null;
            }
        }
        return StorageFactory;
    }
    @Inject(DEFAULT_STORAGE_CONFIGURATION)
    private configuration: StorageConfiguration = {
        name: 'solidium-storage',
        version: '1.0'
    };

    @Factory(DEFAULT_STORAGE)
    getDefaultStorage() {
        // TODO: CREATE DEFAULT STORAGE INSTANCE HERE
    }

    @PostInject()
    init() {
        //
    }
}
