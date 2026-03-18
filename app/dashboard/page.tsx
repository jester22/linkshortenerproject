import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";

export default async function Dashboard(): Promise<React.ReactNode> {
  const { userId } = await auth();

  if (!userId) {
    redirect("/");
  }

  return (
    <div className="min-h-screen bg-slate-950">
      <h1 className="text-white text-3xl font-bold p-6">Dashboard</h1>
    </div>
  );
}
