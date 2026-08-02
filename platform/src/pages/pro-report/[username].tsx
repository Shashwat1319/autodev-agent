import { useEffect } from 'react';
import { useRouter } from 'next/router';

export default function ProReportRedirect() {
  const router = useRouter();
  const { username } = router.query;

  useEffect(() => {
    const u = Array.isArray(username) ? username[0] : username;
    router.replace(u ? `/dashboard?user=${encodeURIComponent(u)}` : '/dashboard');
  }, [username, router]);

  return null;
}
