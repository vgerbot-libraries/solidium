declare module "rollup-plugin-hot" {
	const hmr: (options?: {
		enabled?: boolean;
		hot?: boolean;
		public?: string;
		baseUrl?: string;
		inMemory?: boolean;
	}) => void;
	export default hmr;
}
