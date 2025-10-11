import { UploadResource } from '../resource/UploadResource';
import { execute } from './execute';

/**
 * Executes a file upload request with progress tracking.
 *
 * Use this function for uploading files to the server. It returns an {@link UploadResource}
 * that provides upload progress tracking in addition to standard resource state management.
 *
 * The returned resource exposes:
 * - `data`: The response from the server after upload completes
 * - `progress`: Upload progress information (bytes uploaded, total size, percentage)
 * - `loading`, `success`, `failure`: State indicators
 * - Standard resource methods and properties
 *
 * @param args - Arguments to pass through to the execution context
 *
 * @returns An {@link UploadResource} with progress tracking capabilities
 *
 * @example
 * Uploading a file with FormData:
 * ```typescript
 * @Endpoint({ baseURL: 'https://api.example.com' })
 * class FileAPI {
 *   @Post('/files/upload')
 *   uploadFile(@Payload() formData: FormData) {
 *     return upload<{ fileId: string; url: string }>(formData);
 *   }
 * }
 *
 * // Usage:
 * const formData = new FormData();
 * formData.append('file', fileBlob, 'document.pdf');
 * formData.append('category', 'reports');
 *
 * const resource = api.uploadFile(formData);
 *
 * // Track upload progress:
 * createEffect(() => {
 *   const progress = resource.progress;
 *   if (progress) {
 *     console.log(`Uploaded: ${progress.percentage}%`);
 *     console.log(`${progress.loaded} / ${progress.total} bytes`);
 *   }
 * });
 *
 * // Handle completion:
 * resource.wait().then(state => {
 *   if (state.success) {
 *     console.log('File uploaded:', state.data);
 *   }
 * });
 * ```
 *
 * @example
 * With avatar upload:
 * ```typescript
 * @Post('/users/{id}/avatar')
 * uploadAvatar(
 *   @PathVariable('id') userId: string,
 *   @Payload() formData: FormData
 * ) {
 *   return upload<{ avatarUrl: string }>(userId, formData);
 * }
 *
 * // Usage:
 * const formData = new FormData();
 * formData.append('avatar', avatarBlob);
 * const resource = api.uploadAvatar('user123', formData);
 * ```
 */
export function upload(...args: unknown[]) {
    return execute<BodyInit, UploadResource<BodyInit>>(args, UploadResource);
}
