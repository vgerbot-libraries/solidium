import type { ByteStream } from "../http/ByteStream";
import { DownloadResource } from "../resource/DownloadResource";
import { execute } from "./execute";

/**
 * Executes a file download request with progress tracking.
 *
 * Use this function for downloading files from the server. It returns a {@link DownloadResource}
 * that provides download progress tracking in addition to standard resource state management.
 *
 * The returned resource exposes:
 * - `data`: The downloaded file as a {@link ByteStream}
 * - `progress`: Download progress information (bytes downloaded, total size, percentage)
 * - `loading`, `success`, `failure`: State indicators
 * - Standard resource methods and properties
 *
 * @param args - Arguments to pass through to the execution context
 *
 * @returns A {@link DownloadResource} with progress tracking capabilities
 *
 * @example
 * Downloading a file:
 * ```typescript
 * @Endpoint({ baseURL: 'https://api.example.com' })
 * class FileAPI {
 *   @Get('/files/{id}/download')
 *   downloadFile(@PathVariable('id') fileId: string) {
 *     return download(fileId);
 *   }
 * }
 *
 * // Usage:
 * const resource = api.downloadFile('abc123');
 *
 * // Track progress:
 * createEffect(() => {
 *   const progress = resource.progress;
 *   if (progress) {
 *     console.log(`Downloaded: ${progress.percentage}%`);
 *   }
 * });
 *
 * // Get the file when complete:
 * resource.wait().then(state => {
 *   const blob = state.data?.readAsBlob();
 *   // Create download link, etc.
 * });
 * ```
 *
 * @example
 * Save downloaded file:
 * ```typescript
 * const resource = api.downloadFile('report.pdf');
 * await resource.wait();
 *
 * const blob = await resource.data?.readAsBlob();
 * const url = URL.createObjectURL(blob);
 * const link = document.createElement('a');
 * link.href = url;
 * link.download = 'report.pdf';
 * link.click();
 * ```
 */
export function download(...args: unknown[]) {
	return execute<ByteStream, DownloadResource>(args, DownloadResource);
}
