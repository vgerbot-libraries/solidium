import { SWRInstance } from '@vgerbot/http';
import { Solidium } from '@vgerbot/solidium';
import { Counter, CounterControl } from './Counter';

export function App() {
    const instance = new SWRInstance(
        'date',
        () => {
            return Promise.resolve(new Date().toISOString());
        },
        {}
    );
    instance.mutate();
    return (
        <Solidium>
            <fieldset>
                <legend>Counter 1:</legend>
                <Counter />
            </fieldset>
            <fieldset>
                <legend>Counter 2:</legend>
                <Counter />
            </fieldset>
            <hr></hr>
            <CounterControl />
        </Solidium>
    );
}
