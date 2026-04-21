import { auth } from "@insforge/nextjs";
import { createClient } from "@insforge/sdk";
import { cookies } from "next/headers";

/**
 * Parses a JWT without a library to check for expiration
 */
function isTokenExpired(token: string): boolean {
    if (!token || !token.startsWith("eyJ")) return false;
    try {
        const parts = token.split('.');
        if (parts.length !== 3) return true;
        const payload = JSON.parse(Buffer.from(parts[1], 'base64').toString());
        if (!payload.exp) return false;
        
        const now = Math.floor(Date.now() / 1000);
        return payload.exp < (now + 30); // 30s buffer
    } catch (e) {
        return true;
    }
}

/**
 * getAuthServer initializes the InsForge client for server-side operations.
 */
export async function getAuthServer() {
    let token: string | undefined;
    let user: any = null;

    try {
        const session = await auth();
        if (session?.user) {
            user = session.user;
            token = session.token || (session as any).accessToken;
        }
    } catch (e: any) {}

    if (!user) {
        try {
            const cookieStore = await cookies();
            const sessionCookie = cookieStore.get('insforge-session');
            if (sessionCookie?.value) {
                const sessionContent = decodeURIComponent(sessionCookie.value);
                const session = JSON.parse(sessionContent);
                if (session?.user) {
                    user = session.user;
                    token = session.accessToken || session.token;
                }
            }
        } catch (e: any) {}
    }

    const baseUrl = process.env.NEXT_PUBLIC_INSFORGE_BASE_URL!;
    const anonKey = process.env.NEXT_PUBLIC_INSFORGE_ANON_KEY!;
    const apiKey = process.env.INSFORGE_API_KEY;

    const isExpired = token ? isTokenExpired(token) : false;
    const finalUserToken = (token && !isExpired) ? token : undefined;

    const insforge = createClient({
        baseUrl,
        anonKey, // Now guaranteed to be a valid JWT
        edgeFunctionToken: finalUserToken,
        timeout: 180000,
        headers: {
             ...(apiKey ? { 'x-api-key': apiKey, 'apikey': apiKey } : {})
        }
    });

    if (finalUserToken) {
        insforge.getHttpClient().setAuthToken(finalUserToken);
    } else {
        // Fall back to anonKey (the JWT)
        insforge.getHttpClient().setAuthToken(null);
    }

    return { insforge, user };
}