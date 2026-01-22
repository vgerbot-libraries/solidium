/**
 * Indicates the source of a storage change event.
 *
 * @public
 */
export enum ChangeBy {
	/**
	 * The change was triggered by the current application instance.
	 */
	SELF,
	/**
	 * The change was triggered by another application instance or external source.
	 * For example, changes from other browser tabs/windows.
	 */
	OTHER,
}
