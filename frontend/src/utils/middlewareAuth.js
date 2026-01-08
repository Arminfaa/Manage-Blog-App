export async function middlewareAuth(req) {
  // For httpOnly cookies, we can't access them directly in middleware
  // We need to make a request to the backend which will automatically include the cookies
  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_BASE_URL}/user/profile`,
      {
        method: "GET",
        headers: {
          // Forward the cookies from the request
          cookie: req.headers.get('cookie') || '',
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
