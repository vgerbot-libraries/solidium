import { useService } from '@vgerbot/solidium';
import { Form, ProgressBar } from 'solid-bootstrap';
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
                    }}
                />
            </Form.Group>
            <Show when={uploadResource.pending}>
                <ProgressBar
                    now={uploadResource.progress.percent()}
                    label={`${uploadResource.progress.percent()}%`}
                />
                ;
            </Show>
        </>
    );
}
