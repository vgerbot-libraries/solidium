import { useService } from '@vgerbot/solidium';
import { AuthStateService } from '../auth/AuthStateService';
import { Button, Form, Modal } from 'solid-bootstrap';
import { AuthActionservice } from '../auth/AuthActionService';
import { createSignal } from 'solid-js';

export function LoginDialog() {
    const [username, setUserName] = createSignal('');
    const [password, setPassword] = createSignal('');
    const authService = useService(AuthStateService);
    const authActionService = useService(AuthActionservice);

    return (
        <Modal show={!authService.isAuthenticated} centered>
            <Modal.Header>
                <Modal.Title>Login</Modal.Title>
            </Modal.Header>
            <Form>
                <Modal.Body>
                    <Form.Group class="mb-3">
                        <Form.Label>Username</Form.Label>
                        <Form.Control
                            type="text"
                            placeholder="Username"
                            value={username()}
                            onChange={e => {
                                setUserName(e.target.value);
                            }}
                        ></Form.Control>
                    </Form.Group>
                    <Form.Group class="mb-3">
                        <Form.Label>Password</Form.Label>
                        <Form.Control
                            type="password"
                            placeholder="password"
                            value={password()}
                            onChange={e => {
                                setPassword(e.target.value);
                            }}
                        ></Form.Control>
                    </Form.Group>
                </Modal.Body>
                <Modal.Footer>
                    <Button
                        onClick={() => {
                            authActionService.login({
                                username: username(),
                                password: password()
                            });
                        }}
                    >
                        Login
                    </Button>
                </Modal.Footer>
            </Form>
        </Modal>
    );
}
