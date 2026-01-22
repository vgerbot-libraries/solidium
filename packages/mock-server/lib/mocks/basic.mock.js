/**
 * Example mock endpoints demonstrating basic HTTP methods
 */
export default [
	{
		method: "get",
		path: "/api/users",
		description: "Get a list of users",
		handler: (ctx) => {
			ctx.body = {
				status: "success",
				data: [
					{ id: 1, name: "John Doe", email: "john@example.com" },
					{ id: 2, name: "Jane Smith", email: "jane@example.com" },
					{ id: 3, name: "Bob Johnson", email: "bob@example.com" },
				],
			};
		},
	},
	{
		method: "get",
		path: "/api/users/:id",
		description: "Get a user by ID",
		handler: (ctx) => {
			const id = parseInt(ctx.params.id, 10);
			if (Number.isNaN(id) || id < 1 || id > 3) {
				ctx.status = 404;
				ctx.body = { status: "error", message: "User not found" };
				return;
			}
			const users = [
				{ id: 1, name: "John Doe", email: "john@example.com" },
				{ id: 2, name: "Jane Smith", email: "jane@example.com" },
				{ id: 3, name: "Bob Johnson", email: "bob@example.com" },
			];
			ctx.body = {
				status: "success",
				data: users[id - 1],
			};
		},
	},
	{
		method: "post",
		path: "/api/users",
		description: "Create a new user",
		handler: (ctx) => {
			const { name, email } = ctx.request.body;
			if (!name || !email) {
				ctx.status = 400;
				ctx.body = {
					status: "error",
					message: "Name and email are required",
				};
				return;
			}
			ctx.status = 201;
			ctx.body = {
				status: "success",
				data: {
					id: 4,
					name,
					email,
					createdAt: new Date().toISOString(),
				},
			};
		},
	},
	{
		method: "put",
		path: "/api/users/:id",
		description: "Update a user",
		handler: (ctx) => {
			const id = parseInt(ctx.params.id, 10);
			const { name, email } = ctx.request.body;
			if (Number.isNaN(id) || id < 1 || id > 3) {
				ctx.status = 404;
				ctx.body = { status: "error", message: "User not found" };
				return;
			}
			if (!name && !email) {
				ctx.status = 400;
				ctx.body = { status: "error", message: "No fields to update" };
				return;
			}
			ctx.body = {
				status: "success",
				data: {
					id,
					name: name || `User ${id}`,
					email: email || `user${id}@example.com`,
					updatedAt: new Date().toISOString(),
				},
			};
		},
	},
	{
		method: "delete",
		path: "/api/users/:id",
		description: "Delete a user",
		handler: (ctx) => {
			const id = parseInt(ctx.params.id, 10);
			if (Number.isNaN(id) || id < 1 || id > 3) {
				ctx.status = 404;
				ctx.body = { status: "error", message: "User not found" };
				return;
			}
			ctx.status = 204; // No content response
		},
	},
];
//# sourceMappingURL=basic.mock.js.map
