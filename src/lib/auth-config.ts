// Clerk is optional during local development. The app stays fully runnable
// without keys (auth simply becomes a no-op) and lights up automatically once
// NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY is provided in .env.
export const clerkEnabled =
  !!process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY &&
  process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY.startsWith("pk_");
