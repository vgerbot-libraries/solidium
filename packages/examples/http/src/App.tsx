import { Solidium } from '@vgerbot/solidium';
import { HttpClient } from '@vgerbot/solidium-http';
import { TodoList } from './Todolist';
import { HttpInterceptor } from 'packages/http/lib/types/HttpInterceptor';
import { HttpRequest } from 'packages/http/lib/types/HttpRequest';
import { HttpResponse } from 'packages/http/lib/types/HttpResponse';
class AddRandomParamInterceptor implements HttpInterceptor {
    name = 'ADD-RANDOM-PARAM';
    intercept(
        request: HttpRequest,
        next: (request: HttpRequest) => Promise<HttpResponse>
    ): Promise<HttpResponse> {
        if (Math.random() > 0.5) {
            request.url.searchParams.append('_random', Math.random() + '');
        }
        return next(request);
    }
}

export function App() {
    return (
        <Solidium
            autoRegisterClasses={[
                HttpClient.configure({
                    baseUrl:
                        'https://65e05c45d3db23f7624913ab.mockapi.io/api/v1/',
                    interceptors: [new AddRandomParamInterceptor()]
                })
            ]}
        >
            <TodoList></TodoList>
        </Solidium>
    );
}
