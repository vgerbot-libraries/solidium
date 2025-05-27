import type { Component, ParentProps } from 'solid-js';

import { Solidium } from '@vgerbot/solidium';
import { Notify } from './components/notify';
import { AuthHandler } from './auth/AuthHandler';

const App: Component = (props: ParentProps) => {
    return (
        <Solidium autoRegisterClasses={[]}>
            <main class="container">
                {props.children}
                <Notify.Alert></Notify.Alert>
            </main>
            <AuthHandler></AuthHandler>
        </Solidium>
    );
};

export default App;
