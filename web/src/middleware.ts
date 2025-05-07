import { clerkMiddleware, createRouteMatcher } from '@clerk/nextjs/server';
const isPublicRoute = createRouteMatcher(['/sign-in(.*)', '/sign-up(.*)'])

const isProtectedRoute = createRouteMatcher([
  // Protect all routes except static files and Next.js internals
  '/((?!_next|favicon.ico|.*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
  // Always protect API and TRPC routes
  '/(api|trpc)(.*)',
  '/history',
  '/video-to-video',
]);

export default clerkMiddleware(async (auth, req) => {
  // Only require auth for protected routes
  if (!isPublicRoute(req) || isProtectedRoute(req))  await auth.protect();
});

export const config = {
  matcher: [
    // Protect all routes except static files and Next.js internals
    '/((?!_next|favicon.ico|.*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
    // Always protect API and TRPC routes
    '/(api|trpc)(.*)',
    '/sign-in(.*)',
    '/sign-up(.*)',
    '/history',
    '/video-to-video',
  ],
};