export class Progress {
	constructor(
		public readonly total: number,
		public readonly loaded: number,
		public readonly chunk?: Uint8Array,
	) {}

	public percent(suffix = "%", fractionDigits: number = 2): string {
		const p = 10 ** fractionDigits;
		return (
			(this.total
				? Math.trunc((this.loaded / this.total) * 100 * p + 0.5) / p
				: 0
			).toFixed(fractionDigits) + suffix
		);
	}
}
