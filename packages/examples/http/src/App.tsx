import { Solidium, useService } from '@vgerbot/solidium';
import { ObjectsEndpoint } from './ObjectEndpoint';

export function App() {
    return (
        <Solidium>
            Data: <Objects></Objects>
        </Solidium>
    );
}

function Objects() {
    const endpoint = useService(ObjectsEndpoint);

    const listRes = endpoint.listAll();

    return (
        <ul>
            {listRes.data?.map(it => {
                return <li>{it.name}</li>;
            })}
        </ul>
    );
}
