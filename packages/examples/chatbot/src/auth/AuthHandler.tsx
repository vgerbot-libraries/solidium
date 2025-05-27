import { useService } from '@vgerbot/solidium';
import { AuthStateService } from './AuthStateService';
import { onCleanup } from 'solid-js';
import { useNavigate } from '@solidjs/router';
export function AuthHandler() {
    const navigate = useNavigate();
    const service = useService(AuthStateService);
    onCleanup(
        service.onAuthStateChange((isAuthenticated, initialized) => {
            if (!initialized) {
                return;
            }
            if (!isAuthenticated) {
                navigate('/login', { replace: true });
            } else {
                navigate('/');
            }
        })
    );
    return <></>;
}
