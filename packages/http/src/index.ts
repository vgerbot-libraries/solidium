export * from './core/HttpClient';
export * from './hooks';

/*
import { HttpPlugin } from '@vgerbot/solidium-http'
function App() {
    return <Solidium
        plugins={[
            HttpPlugin.configure({
                baseUrl: '',
                headers: {
                    'X-Header': 'solidium'
                },
                interceptors: [],
            })
        ]}
    ></Solidium>
}

*/

/*
import { Http, useGetResource } from '@vgerbot/solidium-http'
// class UserService {
//     @Http.Get('/auth/user/info')
//     public user!: Resource;
// }

function Profile() {
    const user = useResource('/auth/user/info');
    return <div>
        <Show when={user.pending} fallback={<loading/>}>
            <>
        </Show>
    </div>
}

*/
