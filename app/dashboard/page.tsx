import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { getLinksByUserId } from "@/data/links";
import { CreateLinkDialog } from "./components/CreateLinkDialog";
import { LinkCard } from "./components/LinkCard";

export default async function Dashboard(): Promise<React.ReactNode> {
  const { userId } = await auth();

  if (!userId) {
    redirect("/");
  }

  const userLinks = await getLinksByUserId(userId);

  return (
    <div className="min-h-screen bg-slate-950 p-6">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-white text-3xl font-bold">Dashboard</h1>
        <CreateLinkDialog />
      </div>

      {userLinks.length === 0 ? (
        <p className="text-slate-400">
          You don&apos;t have any links yet. Create your first shortened link!
        </p>
      ) : (
        <ul className="grid gap-4">
          {userLinks.map((link) => (
            <li key={link.id}>
              <LinkCard
                link={{
                  id: link.id,
                  url: link.url,
                  slug: link.slug,
                  createdAt: link.createdAt.toISOString(),
                }}
              />
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
