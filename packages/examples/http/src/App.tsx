import { Persistence } from '@vgerbot/persistence';
import { Solidium } from '@vgerbot/solidium';
import { LocalStorageDriver } from 'packages/persistence/src/drivers/LocalStorageDriver';
import { AlertDialog } from './components/AlertDialog';
import { LoginDialog } from './components/LoginDialog';
import { Profile } from './components/Profile';

export function App() {
    return (
        <Solidium
            autoRegisterClasses={[
                Persistence.default({
                    driver: LocalStorageDriver.createInstance(
                        'solidium-http-example'
                    )
                })
            ]}
        >
            <Profile></Profile>
            <AlertDialog></AlertDialog>
            <LoginDialog></LoginDialog>
        </Solidium>
    );
}
