import { clerkMiddleware, createRouteMatcher } from '@clerk/nextjs/server';

const isProtectedRoute = createRouteMatcher([
  '/video-to-video',
  '/history',
  // '/api/(.*)',
  '/trpc/(.*)',
]);

export default clerkMiddleware(async (auth, req) => {
  // Only require auth for protected routes
  const url = req.nextUrl.pathname;
  if (url === '/api/fal-webhook') {
    // Do not require auth for Fal webhook
    return;
  }
  if (isProtectedRoute(req)) {
    await auth.protect();
  }
});

export const config = {
  matcher: [
    '/((?!_next|favicon.ico|.*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
    '/api/(.*)',
    '/trpc/(.*)',
    '/video-to-video',
    '/history',
  ],
};