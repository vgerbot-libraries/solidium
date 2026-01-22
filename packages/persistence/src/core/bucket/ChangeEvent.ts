import type { ActionType } from "../../types/ActionType";
import type { ChangeBy } from "../../types/ChangeBy";
import type { Data } from "../../types/Data";
import type { Bucket } from "./Bucket";

/**
 * Event object emitted when a storage item changes in a bucket.
 *
 * @public
 */
export interface ChangeEvent {
	/**
	 * The bucket instance where the change occurred.
	 */
	target: Bucket;
	/**
	 * The key of the storage item that changed.
	 */
	key: string;
	/**
	 * Indicates whether the change was made by the current instance or another source.
	 */
	changeBy: ChangeBy;
	/**
	 * The type of action performed (update or remove).
	 */
	action: ActionType;
	/**
	 * The value before the change (undefined if the item was newly created).
	 */
	originValue?: Data;
	/**
	 * The new value after the change (undefined if the item was removed).
	 */
	newValue?: Data;
}
