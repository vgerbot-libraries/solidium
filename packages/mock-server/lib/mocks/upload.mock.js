/**
 * Example mock endpoints demonstrating file upload handling
 */
export default [
	{
		method: "post",
		path: "/api/upload/single",
		description: "Handle single file upload",
		handler: async (ctx) => {
			const file = ctx.request.files?.file;
			if (!file) {
				ctx.status = 400;
				ctx.body = {
					status: "error",
					message: "No file uploaded",
				};
				return;
			}
			// Handle both array and single file object (koa-body may provide either)
			const fileObj = Array.isArray(file) ? file[0] : file;
			ctx.body = {
				status: "success",
				data: {
					filename: fileObj.originalFilename,
					size: fileObj.size,
					type: fileObj.mimetype,
					lastModified: new Date().toISOString(),
				},
			};
		},
	},
	{
		method: "post",
		path: "/api/upload/multiple",
		description: "Handle multiple file uploads",
		handler: async (ctx) => {
			const files = ctx.request.files?.files;
			if (!files) {
				ctx.status = 400;
				ctx.body = {
					status: "error",
					message: "No files uploaded",
				};
				return;
			}
			// Convert to array if not already
			const fileArray = Array.isArray(files) ? files : [files];
			const fileDetails = fileArray.map((file) => ({
				filename: file.originalFilename,
				size: file.size,
				type: file.mimetype,
			}));
			ctx.body = {
				status: "success",
				data: {
					uploadedFiles: fileDetails,
					totalFiles: fileDetails.length,
					totalSize: fileDetails.reduce((sum, file) => sum + file.size, 0),
				},
			};
		},
	},
	{
		method: "post",
		path: "/api/upload/with-metadata",
		description: "Handle file upload with additional metadata",
		handler: async (ctx) => {
			const file = ctx.request.files?.file;
			const metadata = ctx.request.body?.metadata;
			if (!file) {
				ctx.status = 400;
				ctx.body = {
					status: "error",
					message: "No file uploaded",
				};
				return;
			}
			const fileObj = Array.isArray(file) ? file[0] : file;
			ctx.body = {
				status: "success",
				data: {
					file: {
						filename: fileObj.originalFilename,
						size: fileObj.size,
						type: fileObj.mimetype,
					},
					metadata: metadata ? JSON.parse(metadata) : {},
					timestamp: new Date().toISOString(),
				},
			};
		},
	},
];
//# sourceMappingURL=upload.mock.js.map
