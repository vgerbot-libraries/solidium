import { FetchRequestAdapter } from '../adapter/FetchRequestAdapter';
import { getExecutionContext } from '../core/execution-context';
import { JSONSSEResource } from '../resource/JSONSSEResource';
import { execute } from './execute';

/**
 * Executes a Server-Sent Events (SSE) request that streams JSON objects.
 *
 * Use this function for real-time streaming endpoints that send JSON data over SSE.
 * Each server-sent event will be automatically parsed as JSON and made available through
 * the {@link JSONSSEResource}. The resource accumulates all received messages in the
 * `messages` array while also providing the latest message in `data`.
 *
 * This function automatically uses the {@link FetchRequestAdapter} which is required
 * for streaming responses.
 *
 * The returned resource exposes:
 * - `data`: The most recent JSON message received
 * - `messages`: Array of all JSON messages received so far
 * - `loading`, `success`, `failure`: State indicators
 * - `opened`: Indicates if the SSE connection is established
 *
 * @template T - The type of JSON objects in the SSE stream
 * @param args - Arguments to pass through to the execution context
 *
 * @returns A {@link JSONSSEResource} for handling the SSE stream
 *
 * @throws {Error} If called outside of an endpoint method context
 *
 * @example
 * Live updates stream:
 * ```typescript
 * @Endpoint({ baseURL: 'https://api.example.com' })
 * class EventAPI {
 *   @Get('/events/stream')
 *   streamEvents(@Query('topic') topic: string) {
 *     return jsonsse<EventData>(topic);
 *   }
 * }
 *
 * interface EventData {
 *   id: string;
 *   type: string;
 *   payload: unknown;
 * }
 *
 * // Usage:
 * const resource = api.streamEvents('notifications');
 *
 * // Access latest message:
 * createEffect(() => {
 *   const latestEvent = resource.data;
 *   if (latestEvent) {
 *     console.log('New event:', latestEvent);
 *   }
 * });
 *
 * // Access all messages:
 * createEffect(() => {
 *   console.log('All events:', resource.messages);
 * });
 * ```
 *
 * @example
 * Real-time chat:
 * ```typescript
 * @Get('/chat/{roomId}/messages')
 * streamMessages(@PathVariable('roomId') roomId: string) {
 *   return jsonsse<ChatMessage>(roomId);
 * }
 *
 * interface ChatMessage {
 *   id: string;
 *   author: string;
 *   text: string;
 *   timestamp: number;
 * }
 *
 * // Usage:
 * const resource = api.streamMessages('room-123');
 *
 * // Render all messages:
 * <For each={resource.messages}>
 *   {(message) => <div>{message.author}: {message.text}</div>}
 * </For>
 * ```
 *
 * @see {@link JSONSSEResource} for more details on the resource type
 */
export function jsonsse<T>(...args: unknown[]) {
    const context = getExecutionContext();
    if (!context) {
        throw new Error(
            'No request context. Make sure to call `request` only within endpoint methods.'
        );
    }
    context.params.adapter = FetchRequestAdapter;
    return execute<T, JSONSSEResource<T>>(args, JSONSSEResource);
}
