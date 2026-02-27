import { env } from "cloudflare:workers"
import { sign } from "hono/jwt";
import { CookieOptions } from "hono/utils/cookie";

const generateToken = async (userID: number) => {
    const secret = env.JWT_TOKEN_SECRET;
    const timeNow = Math.floor(Date.now() / 1000);
    const payload = {
        sub: userID,
        iat: timeNow,
        exp: timeNow + 3 * 60 * 60
    };

    const token = await sign(payload, secret, 'HS256');
    return token;
}

const cookieOpts = {
    httpOnly: true,
    secure: true,
    sameSite: 'lax',
    path: '/',
    maxAge: 3600 * 3
} as CookieOptions;

export { generateToken, cookieOpts };
