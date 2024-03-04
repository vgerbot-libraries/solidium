import { useJSON } from '@vgerbot/solidium-http';
import { For, createEffect } from 'solid-js';
import { Show } from 'solid-js/web';

export function TodoList() {
    const resource = useJSON<
        Array<{
            createdAt: string;
            name: string;
            avatar: string;
            id: string;
        }>
    >({
        url: 'tasks'
    });
    createEffect(() => {
        console.log(resource.data);
    });
    return (
        <div>
            Tasks:
            <Show when={resource.pending}>Loading....</Show>
            <Show when={resource.success}>
                <ul>
                    <For each={resource.data || []}>
                        {it => {
                            return (
                                <li>
                                    <img
                                        src={it.avatar}
                                        width={32}
                                        height={32}
                                        alt={'Avatar of ' + it.name}
                                    />
                                    <dl>
                                        <dt>{it.name}</dt>
                                        <dd>{it.createdAt}</dd>
                                    </dl>
                                </li>
                            );
                        }}
                    </For>
                </ul>
            </Show>
            <Show when={resource.failure}>
                Failed: {resource.response?.statusText}
            </Show>
        </div>
    );
}
