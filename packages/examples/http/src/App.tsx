import { DefaultDrivers, Persistence } from '@vgerbot/persistence';
import { Solidium } from '@vgerbot/solidium';
import { AlertDialog } from './components/AlertDialog';
import { LoginDialog } from './components/LoginDialog';
import { Profile } from './components/Profile';
import { UploadExample } from './upload/UploadExample';
import { RefreshToken } from './components/RefreshToken';

export function App() {
    return (
        <Solidium
            autoRegisterClasses={[
                Persistence.default({
                    driver: DefaultDrivers.LOCAL_STORAGE,
                    debug: true
                })
            ]}
        >
            <Profile></Profile>
            <span>{'='.repeat(100)}</span>
            <Profile></Profile>
            <RefreshToken></RefreshToken>
            <UploadExample></UploadExample>
            <AlertDialog></AlertDialog>
            <LoginDialog></LoginDialog>
        </Solidium>
    );
}
