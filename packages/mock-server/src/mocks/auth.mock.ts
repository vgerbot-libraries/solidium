import { Context } from 'koa';

// Simple in-memory "database" for demo purposes
const users = [
    { id: 1, username: 'admin', password: 'admin123', role: 'admin' },
    { id: 2, username: 'user', password: 'user123', role: 'user' }
];

// Store for refresh tokens
const refreshTokens = new Map<string, { userId: number; exp: number }>();

// Helper to generate a token
const generateToken = (userId: number, expiry: number): string => {
    return Buffer.from(
        JSON.stringify({
            userId,
            exp: Date.now() + expiry
        })
    ).toString('base64');
};

// Helper to validate a token
const validateToken = (token: string): { valid: boolean; userId?: number } => {
    try {
        const payload = JSON.parse(Buffer.from(token, 'base64').toString());
        if (payload.exp < Date.now()) {
            return { valid: false };
        }
        return { valid: true, userId: payload.userId };
    } catch (err) {
        return { valid: false };
    }
};

/**
 * Example mock endpoints demonstrating authentication scenarios
 */
export default [
    {
        method: 'post',
        path: '/api/auth/login',
        description: 'Login with username and password',
        handler: (ctx: Context) => {
            const { username, password } = ctx.request.body as any;

            if (!username || !password) {
                ctx.status = 400;
                ctx.body = {
                    status: 'error',
                    message: 'Username and password are required'
                };
                return;
            }

            const user = users.find(
                u => u.username === username && u.password === password
            );

            if (!user) {
                ctx.status = 401;
                ctx.body = {
                    status: 'error',
                    message: 'Invalid username or password'
                };
                return;
            }

            // Generate access token (15 minutes)
            const accessToken = generateToken(user.id, 15 * 60 * 1000);

            // Generate refresh token (7 days)
            const refreshToken = generateToken(
                user.id,
                7 * 24 * 60 * 60 * 1000
            );

            // Store refresh token
            refreshTokens.set(refreshToken, {
                userId: user.id,
                exp: Date.now() + 7 * 24 * 60 * 60 * 1000
            });

            ctx.body = {
                status: 'success',
                data: {
                    userId: user.id,
                    username: user.username,
                    role: user.role,
                    accessToken,
                    refreshToken,
                    expiresIn: 900 // 15 minutes in seconds
                }
            };
        }
    },
    {
        method: 'post',
        path: '/api/auth/token',
        description: 'Refresh access token using refresh token',
        handler: (ctx: Context) => {
            const { refreshToken } = ctx.request.body as any;

            if (!refreshToken) {
                ctx.status = 400;
                ctx.body = {
                    status: 'error',
                    message: 'Refresh token is required'
                };
                return;
            }

            const storedToken = refreshTokens.get(refreshToken);

            if (!storedToken || storedToken.exp < Date.now()) {
                ctx.status = 401;
                ctx.body = {
                    status: 'error',
                    message: 'Invalid or expired refresh token'
                };
                return;
            }

            // Generate a new access token
            const accessToken = generateToken(
                storedToken.userId,
                15 * 60 * 1000
            );

            ctx.body = {
                status: 'success',
                data: {
                    accessToken,
                    expiresIn: 900 // 15 minutes in seconds
                }
            };
        }
    },
    {
        method: 'post',
        path: '/api/auth/logout',
        description: 'Logout and invalidate refresh token',
        handler: (ctx: Context) => {
            const { refreshToken } = ctx.request.body as any;

            if (refreshToken) {
                refreshTokens.delete(refreshToken);
            }

            ctx.body = {
                status: 'success',
                message: 'Successfully logged out'
            };
        }
    },
    {
        method: 'get',
        path: '/api/auth/profile',
        description: 'Get user profile (protected route)',
        handler: (ctx: Context) => {
            const authHeader = ctx.headers.authorization;

            if (!authHeader || !authHeader.startsWith('Bearer ')) {
                ctx.status = 401;
                ctx.body = {
                    status: 'error',
                    message: 'Authorization token is required'
                };
                return;
            }

            const token = authHeader.substring(7); // Remove 'Bearer ' prefix
            const validation = validateToken(token);

            if (!validation.valid) {
                ctx.status = 401;
                ctx.body = {
                    status: 'error',
                    message: 'Invalid or expired token'
                };
                return;
            }

            const user = users.find(u => u.id === validation.userId);

            if (!user) {
                ctx.status = 404;
                ctx.body = {
                    status: 'error',
                    message: 'User not found'
                };
                return;
            }

            ctx.body = {
                status: 'success',
                data: {
                    id: user.id,
                    username: user.username,
                    role: user.role
                }
            };
        }
    }
];
