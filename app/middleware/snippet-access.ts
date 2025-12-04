import { authClient } from '~/lib/auth-client';

//TODO CLEAN UP / FIX

/**
 * This middleware protects private snippets.
 * It runs on the server before a snippet page is rendered.
 * If a snippet is private, it ensures the current user is the author.
 * If not, it redirects the user to the homepage.
 */
export default defineNuxtRouteMiddleware(async (to) => {
    if (!import.meta.server) {
        return;
    }

    const id = to.params.id as string;

    const snippet = await $fetch(`/api/snippets/${id}`).catch(() => null);

    if (!snippet || snippet.isPublic) {
        return;
    }

    const fetchOptions = { headers: useRequestHeaders(['cookie']) };
    const { data: session } = await authClient.getSession({ fetchOptions });

    if (snippet.userId !== session?.user?.id) {
        return navigateTo('/', { redirectCode: 302 });
    }
});