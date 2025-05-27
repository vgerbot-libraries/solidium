/* @refresh reload */
import { render } from 'solid-js/web';
import '@picocss/pico/css/pico.min.css';
import './mock-server';

import './index.css';
import App from './App';
import { Route, Router } from '@solidjs/router';
import { MainPage } from './pages/main';
import { LoginPage } from './pages/login';
import { ChatPage } from './pages/chat';
import { NotFoundPage } from './pages/error/404';

const root = document.getElementById('root');

if (import.meta.env.DEV && !(root instanceof HTMLElement)) {
    throw new Error(
        'Root element not found. Did you forget to add it to your index.html? Or maybe the id attribute got misspelled?'
    );
}

render(
    () => (
        <Router root={App}>
            <Route path="/" component={MainPage}></Route>
            <Route path="/login" component={LoginPage}></Route>
            <Route path="/chat" component={ChatPage}></Route>
            <Route path="*404" component={NotFoundPage}></Route>
        </Router>
    ),
    root as HTMLElement
);
