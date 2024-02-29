import { Solidium } from '@vgerbot/solidium';
import { HttpClient } from '@vgerbot/solidium-http';
import { TodoList } from './Todolist';

export function App() {
    return (
        <Solidium
            autoRegisterClasses={[
                HttpClient.configure({
                    baseUrl:
                        'https://65e05c45d3db23f7624913ab.mockapi.io/api/v1/'
                })
            ]}
        >
            <TodoList></TodoList>
        </Solidium>
    );
}
