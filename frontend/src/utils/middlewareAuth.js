export async function middlewareAuth(req) {
  // In Next.js middleware, we can't access localStorage
  // So we need to check for authorization header or cookies
  try {
    const authHeader = req.headers.get('authorization');
    const cookieHeader = req.headers.get('cookie') || '';

    const res = await fetch(
      `${process.env.NEXT_PUBLIC_BASE_URL}/user/profile`,
      {
        method: "GET",
        headers: {
          ...(authHeader && { authorization: authHeader }),
          ...(cookieHeader && { cookie: cookieHeader }),
        },
      }
    );

    if (res.ok) {
      const { data } = await res.json();
      const { user } = data || {};
      return user;
    }
  } catch (error) {
    console.error('Middleware auth error:', error);
  }

  return null;
}
