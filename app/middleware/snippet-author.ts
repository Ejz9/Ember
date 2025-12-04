import { authClient } from '~/lib/auth-client';

//TODO CLEAN UP / FIX

/**
 * This middleware ensures that only the author of a snippet can access a route.
 * It runs on the server-side before the page is rendered.
 * If the user is not logged in or the owner of a snippet they are redirected home.
 */
export default defineNuxtRouteMiddleware(async (to) => {
    if (!import.meta.server) {
        return;
    }

    const id = to.params.id as string;

    const fetchOptions: any = {
        headers: useRequestHeaders(['cookie']),
        baseURL: `${useRequestURL().origin}/api/auth`
    };

    try {
        const { data: session } = await authClient.getSession({ fetchOptions });

        if (!session?.user?.id) {
            return navigateTo('/', { redirectCode: 302 });
        }

        const snippet = await $fetch(`/api/snippets/${id}`).catch(() => null);

        if (!snippet || snippet.userId !== session.user.id) {
            return navigateTo('/', { redirectCode: 302 });
        }
    } catch (error) {
        console.error("Snippet author middleware error:", error);
        return navigateTo('/', { redirectCode: 302 });
    }
});