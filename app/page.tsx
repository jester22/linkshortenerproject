import { auth } from "@clerk/nextjs/server";

export default async function Home(): Promise<React.ReactNode> {
  const { userId } = await auth();

  // Middleware will redirect authenticated users, but we check here for safety
  if (userId) {
    return null;
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-950 font-sans">
      <main className="flex flex-col items-center justify-center py-32 px-16 text-center gap-6">
        <h1 className="text-4xl font-bold text-white">
          Welcome to Link Shortener
        </h1>
        <p className="text-lg text-gray-300 max-w-md">
          Create shortened URLs and track your links with ease.
        </p>
        <p className="text-base text-gray-400">Sign in to get started.</p>
      </main>
    </div>
  );
}
