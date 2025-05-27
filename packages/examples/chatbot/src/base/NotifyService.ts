import { Signal } from '@vgerbot/solidium';
import { batch } from 'solid-js';
import { ModalService } from './ModalService';
import { Inject } from '@vgerbot/ioc';

export class NotifyService {
    @Signal()
    showAlert: boolean = false;
    @Signal()
    alertOptions?: { title?: string; message: string };
    @Inject()
    modalService!: ModalService;

    alert(options: { title?: string; message: string }) {
        batch(() => {
            this.alertOptions = options;
            this.showAlert = true;
        });
        return this.modalService.takeUntil(() => !this.showAlert);
    }
    closeAlert() {
        batch(() => {
            this.alertOptions = undefined;
            this.showAlert = false;
        });
    }
}
