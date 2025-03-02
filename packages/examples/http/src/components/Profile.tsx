import { useService } from '@vgerbot/solidium';
import { AuthActionService } from '../auth/AuthActionService';

export function Profile() {
    const service = useService(AuthActionService);
    const profile = service.profile();
    return (
        <div>
            <div>ID: {profile.data?.data?.id}</div>
            <div>Name: {profile.data?.data?.name}</div>
            <div>Role: {profile.data?.data?.role}</div>
        </div>
    );
}
