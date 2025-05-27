import { http, HttpResponse } from 'msw';
const users = [
    { id: 1, username: 'admin', password: 'admin123', role: 'admin' },
    { id: 2, username: 'user', password: 'user123', role: 'user' }
];
const refreshTokens = new Map<string, { userId: number; exp: number }>();

export const authHandlers = [
    http.post('/api/auth/login', async ctx => {
        const { username, password } = (await ctx.request.json()) as {
            username: string;
            password: string;
        };

        if (!username || !password) {
            return HttpResponse.json(
                {
                    status: 'error',
                    message: 'Username and password are required'
                },
                {
                    status: 400,
                    statusText: 'Bad Request'
                }
            );
        }
        const user = users.find(
            u => u.username === username && u.password === password
        );

        if (!user) {
            return HttpResponse.json(
                {
                    status: 'error',
                    message: 'Invalid username or password'
                },
                { status: 401, statusText: 'Unauthorized' }
            );
        }
        const expiresIn = 15 * 60 * 1000;
        // Generate a JWT token with a 15 minute expiry
        const token = generateToken(user.id.toString(), expiresIn);

        // Store the token in the refreshTokens map with an expiration time
        const refreshToken = generateToken(
            user.id.toString(),
            7 * 24 * 60 * 60 * 1000
        );
        refreshTokens.set(refreshToken, {
            userId: user.id,
            exp: Date.now() + 7 * 24 * 60 * 60 * 1000
        });

        return HttpResponse.json(
            {
                status: 'success',
                data: {
                    userId: user.id,
                    username: user.username,
                    role: user.role,
                    accessToken: token,
                    refreshToken,
                    expiresIn
                }
            },
            {
                status: 200,
                statusText: 'OK'
            }
        );
    }),
    http.post('/api/auth/refresh', async ctx => {
        const { refreshToken } = (await ctx.request.json()) as {
            refreshToken: string;
        };

        if (!refreshToken) {
            return HttpResponse.json(
                {
                    status: 'error',
                    message: 'Refresh token is required'
                },
                { status: 400, statusText: 'Bad Request' }
            );
        }
        const tokenData = refreshTokens.get(refreshToken);
        if (!tokenData || tokenData.exp < Date.now()) {
            return HttpResponse.json(
                {
                    status: 'error',
                    message: 'Invalid or expired refresh token'
                },
                { status: 401, statusText: 'Unauthorized' }
            );
        }
        const expiresIn = 15 * 60 * 1000;
        const token = generateToken(tokenData.userId.toString(), expiresIn);
        refreshTokens.set(refreshToken, {
            userId: tokenData.userId,
            exp: Date.now() + expiresIn
        });

        return HttpResponse.json(
            {
                status: 'success',
                data: {
                    accessToken: token,
                    expiresIn
                }
            },
            {
                status: 200,
                statusText: 'OK'
            }
        );
    }),
    http.get('/api/auth/profile', async ctx => {
        const authorization = ctx.request.headers.get('authorization');
        if (!authorization) {
            return HttpResponse.json(
                {
                    status: 'error',
                    message: 'Authorization header is required'
                },
                { status: 401, statusText: 'Unauthorized' }
            );
        }
        const token = authorization.split(' ')[1]; // Bearer <token>
        const { valid, userId } = validateToken(token);
        if (!valid) {
            return HttpResponse.json(
                {
                    status: 'error',
                    message: 'Invalid or expired access token'
                },
                { status: 401, statusText: 'Unauthorized' }
            );
        }
        const user = users.find(u => u.id === userId);
        if (!user) {
            return HttpResponse.json(
                {
                    status: 'error',
                    message: 'User not found'
                },
                { status: 404, statusText: 'Not Found' }
            );
        }
        return HttpResponse.json(
            {
                status: 'success',
                data: {
                    userId: user.id,
                    username: user.username,
                    role: user.role
                }
            },
            {
                status: 200,
                statusText: 'OK'
            }
        );
    })
];

function generateToken(userId: string, expiry: number) {
    return btoa(JSON.stringify({ userId, exp: Date.now() + expiry }));
}

function validateToken(token: string) {
    try {
        const payload = JSON.parse(atob(token));
        if (payload.exp < Date.now()) {
            return { valid: false };
        }
        return { valid: true, userId: payload.userId };
    } catch {
        return { valid: false };
    }
}
