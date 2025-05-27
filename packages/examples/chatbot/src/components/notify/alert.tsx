import { useService } from '@vgerbot/solidium';
import { NotifyService } from '../../base/NotifyService';
import { createEffect } from 'solid-js';

export function Alert() {
    let dialogElement: HTMLDialogElement | undefined;
    const notifyService = useService(NotifyService);
    createEffect(() => {
        if (notifyService.showAlert && dialogElement) {
            dialogElement.showModal();
        } else if (dialogElement) {
            dialogElement.close();
        }
    });
    return (
        <dialog ref={dialogElement}>
            <article>
                <h3>{notifyService.alertOptions?.title}</h3>
                <p>{notifyService.alertOptions?.message}</p>
                <footer>
                    <button onClick={() => notifyService.closeAlert()}>
                        OK
                    </button>
                </footer>
            </article>
        </dialog>
    );
}
