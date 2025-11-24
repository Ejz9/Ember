import { authClient } from '~/lib/auth-client';

/**
 * This middleware ensures that only the author of a snippet can access a route.
 * It runs on the server-side before the page is rendered.
 * If the user is not logged in or the owner of a snippet they are redirected home.
 */
export default defineNuxtRouteMiddleware(async (to) => {
  if (import.meta.server) {
    const id = to.params.id as string;
    const session = authClient.useSession();

    if (!session?.user?.id) {
      return navigateTo('/', { redirectCode: 302 });
    }

    const snippet = await $fetch(`/api/snippets/${id}`).catch(() => null);

    if (!snippet || snippet.userId !== session.user.id) {
      return navigateTo(`/snippets/${id}`, { redirectCode: 302 });
    }
  }
});