import { Solidium, useService } from '@vgerbot/solidium';
import { createEffect, createSignal, Show } from 'solid-js';
import { ObjectsEndpoint } from './ObjectEndpoint';
import { SSEEndpoint } from './SSEEndpoint';

export function App() {
    return (
        <Solidium>
            Data: <Objects></Objects>
            Object Item: <ObjectItem></ObjectItem>
            SSE: <SSE></SSE>
        </Solidium>
    );
}

function ObjectItem() {
    const [id, setId] = createSignal<string>('0');
    const endpoint = useService(ObjectsEndpoint);
    const res = endpoint.getItem(id);
    return (
        <div>
            <form>
                <label>
                    Object ID:
                    <input
                        onChange={e => {
                            setId(e.target.value);
                        }}
                        type="number"
                        value="0"
                    ></input>
                </label>
            </form>
            <Show when={res.pending}>
                <span>Loading...</span>
            </Show>
            <Show when={res.success}>
                <code>{JSON.stringify(res.data)}</code>
            </Show>
        </div>
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

function SSE() {
    const endpoint = useService(SSEEndpoint);

    const eventsResource = endpoint.events();

    return (
        <ul>
            {eventsResource.messages.map(it => {
                return <li>{JSON.stringify(it)}</li>;
            })}
        </ul>
    );
}
