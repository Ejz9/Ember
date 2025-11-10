import { useAuth } from '../../utils/auth';

export default defineEventHandler((event) => {
  const auth = useAuth();
  return auth.handler(toWebRequest(event));
});