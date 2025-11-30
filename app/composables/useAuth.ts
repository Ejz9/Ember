import {authClient} from "~/lib/auth-client";

export const useSignOut = () => {
    const router = useRouter()

    return async () => {
        await authClient.signOut()
        await router.push('/')
    }
}