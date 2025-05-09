import { useService } from '@vgerbot/solidium';
import { Alert, Form, ProgressBar } from 'solid-bootstrap';
import { UploadEndpoint } from './UploadEndpoint';
import { createSignal, Show } from 'solid-js';
export function UploadExample() {
    const endpoint = useService(UploadEndpoint);
    const [getFile, setFile] = createSignal<File>();

    const uploadResource = endpoint.uploadSingle(() => {
        const file = getFile();
        if (!file) {
            return null;
        }
        const formdata = new FormData();
        formdata.set('file', file);
        return formdata;
    });

    return (
        <>
            <Form.Group controlId="formFile" class="mb-3">
                <Form.Label>Upload File: </Form.Label>
                <Form.Control
                    type="file"
                    onChange={e => {
                        const input = e.target as HTMLInputElement;
                        const file = input.files?.[0];
                        setFile(file);
                        e.target.value = '';
                    }}
                />
            </Form.Group>
            <Show when={uploadResource.opened}>
                <Alert variant="info">Reqest is opened</Alert>
            </Show>
            <Show when={uploadResource.loading}>
                <ProgressBar
                    now={parseFloat(uploadResource.progress.percent())}
                    label={uploadResource.progress.percent('%')}
                />
            </Show>
            <Show when={uploadResource.aborted}>
                <Alert variant="warning">Aborted</Alert>
            </Show>
            <Show when={uploadResource.failure}>
                <Alert variant="danger">
                    {uploadResource.error?.toString()}
                </Alert>
            </Show>
        </>
    );
}
