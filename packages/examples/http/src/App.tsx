import { Solidium, useService } from '@vgerbot/solidium';
import { ObjectsEndpoint } from './ObjectEndpoint';
import { createEffect, Show } from 'solid-js';

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

    createEffect(() => {
        console.log('pending', listRes.pending);
        console.log('success', listRes.success);
        console.log('failure', listRes.failure);
        console.log('abortde', listRes.aborted);
        console.log('========');
    });

    return (
        <>
            <Show when={listRes.pending}>
                <h1>loading.....</h1>
            </Show>
            <Show when={listRes.success}>
                <ul>
                    {listRes.data?.map(it => {
                        return <li>{it.name}</li>;
                    })}
                </ul>
            </Show>
            <Show when={listRes.failure}>Error: {listRes.error + ''}</Show>
            <Show when={listRes.aborted}>Aborted</Show>
        </>
    );
}
