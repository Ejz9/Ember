import { authClient } from "@/lib/auth-client";

/**
 * This middleware ensures that only an admin user can access a route.
 * It runs on the server-side before the page is rendered.
 * If the user is not logged in or not an admin, they are redirected home.
 */
export default defineNuxtRouteMiddleware(async (to) => {
    let fetchOptions: any = {
        headers: import.meta.server ? useRequestHeaders(['cookie']) : undefined,
    };

    if (import.meta.server) {
        const url = useRequestURL();
        fetchOptions.baseURL = `${url.origin}/api/auth`;
    }

    try {
        const { data: session } = await authClient.getSession({
            fetchOptions
        });

        if (!session?.user || !session.user.isAdmin) {
            return navigateTo('/', { redirectCode: 302 });
        }
    } catch (error) {
        console.error("Auth middleware error:", error);
        return navigateTo('/', { redirectCode: 302 });
    }
});