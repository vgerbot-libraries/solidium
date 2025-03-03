import { DefaultDrivers, Persistence } from '@vgerbot/persistence';
import { Solidium } from '@vgerbot/solidium';
import { AlertDialog } from './components/AlertDialog';
import { LoginDialog } from './components/LoginDialog';
import { Profile } from './components/Profile';

export function App() {
    return (
        <Solidium
            autoRegisterClasses={[
                Persistence.default({
                    driver: DefaultDrivers.LOCAL_STORAGE
                })
            ]}
        >
            <Profile></Profile>
            <AlertDialog></AlertDialog>
            <LoginDialog></LoginDialog>
        </Solidium>
    );
}
