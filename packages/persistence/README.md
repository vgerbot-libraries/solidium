# `@vgerbot/solidium-persistence`

```ts
import { Observe } from '@vgerbot/solidium';
import { createInstance, drivers } from '@vgerbot/solidium-persistence'

const idb = createInstance({
    driver: drivers.IDB,
    name: 'database name',
    storeName: 'store name',
    version: 'idb version'
})

class DataService {
    @idb.Value('data-key')
    public readonly data: string;
    
    @Observe()
    onDataChanged() {
        console.log(data);
    }
}
```
