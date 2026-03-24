import type { Metadata } from "next";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export const metadata: Metadata = {
  title: "Test Page — Link Shortener",
  description: "A simple test route for verifying page creation in the app.",
};

export default function TestPage(): React.ReactNode {
  return (
    <main className="min-h-screen bg-slate-950 px-6 py-16">
      <div className="mx-auto flex max-w-3xl flex-col gap-6">
        <Card className="border border-slate-800 bg-slate-900 text-white">
          <CardHeader className="space-y-2">
            <CardTitle className="text-3xl font-bold text-white">
              Test Page
            </CardTitle>
            <CardDescription className="text-base text-slate-400">
              This route was added to confirm that custom App Router pages are
              working as expected.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4 text-slate-300">
            <p>
              You can visit this page at <code>/test-page</code>.
            </p>
            <p>
              It uses the existing design language from the project, including
              shadcn/ui components and the current dark theme styling.
            </p>
          </CardContent>
          <CardFooter className="border-slate-800 bg-slate-950/50">
            <Button asChild variant="outline">
              <Link href="/">Back to home</Link>
            </Button>
          </CardFooter>
        </Card>
      </div>
    </main>
  );
}
