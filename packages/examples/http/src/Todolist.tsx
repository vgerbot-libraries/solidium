import { useResource } from '@vgerbot/solidium-http';
import { Show } from 'solid-js/web';

export function TodoList() {
    const resource = useResource({
        url: 'tasks'
    });
    return (
        <div>
            Tasks:
            <Show when={resource.pending}>Loading....</Show>
            <Show when={resource.success}>
                {(() => {
                    console.log(resource);
                    return '';
                })()}
            </Show>
            <Show when={resource.failure}>Failed!</Show>
        </div>
    );
}
