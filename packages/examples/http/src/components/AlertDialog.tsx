import { useService } from "@vgerbot/solidium";
import { Button, Modal } from "solid-bootstrap";
import { NotifyService } from "../base/NotifyService";

export function AlertDialog() {
	const notifyService = useService(NotifyService);
	const handleClose = () => {
		notifyService.closeAlert();
	};

	return (
		<Modal
			show={notifyService.showAlert}
			onHide={handleClose}
			size="sm"
			centered
		>
			<Modal.Header closeButton>
				<Modal.Title>
					{notifyService.alertOptions?.title ?? "System"}
				</Modal.Title>
			</Modal.Header>
			<Modal.Body>{notifyService.alertOptions?.message}</Modal.Body>
			<Modal.Footer>
				<Button onClick={handleClose}>OK</Button>
			</Modal.Footer>
		</Modal>
	);
}
