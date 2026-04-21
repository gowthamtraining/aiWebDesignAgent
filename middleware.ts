import { InsforgeMiddleware } from '@insforge/nextjs/middleware';

export default InsforgeMiddleware({
  baseUrl: process.env.NEXT_PUBLIC_INSFORGE_BASE_URL!,
  publicRoutes: [
    '/', 
    '/auth/sign-in', 
    '/auth/sign-up', 
    '/auth/forgot-password', 
    '/auth/reset-password',
    '/auth/verify-email'
  ],
  signInUrl: '/auth/sign-in',
  signUpUrl: '/auth/sign-up',
  forgotPasswordUrl: '/auth/forgot-password',
  useBuiltInAuth: false,
});

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
};