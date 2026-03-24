import { SignInButton, SignUpButton } from "@clerk/nextjs";
import { auth } from "@clerk/nextjs/server";
import { Link2, Pencil, Share2, Shield, Zap } from "lucide-react";
import { Button } from "@/components/ui/button";

const features = [
  {
    icon: Link2,
    title: "URL Shortening",
    description:
      "Transform long, unwieldy URLs into clean, concise links in seconds.",
  },
  {
    icon: Pencil,
    title: "Custom Slugs",
    description:
      "Create memorable, branded short links with custom slugs that reflect your content.",
  },
  {
    icon: Zap,
    title: "Lightning Fast",
    description:
      "Instant redirects with no delays — your links resolve in milliseconds.",
  },
  {
    icon: Shield,
    title: "Secure & Reliable",
    description:
      "Your links are always available. We ensure uptime and safe redirects.",
  },
  {
    icon: Share2,
    title: "Easy Sharing",
    description:
      "Share your short links anywhere — social media, emails, or any platform.",
  },
] as const;

const steps = [
  {
    number: "01",
    title: "Paste Your URL",
    description: "Enter any long URL you want to shorten into our simple form.",
  },
  {
    number: "02",
    title: "Get Your Short Link",
    description: "Instantly receive a shortened, shareable link.",
  },
  {
    number: "03",
    title: "Share & Go",
    description:
      "Share your link anywhere — your audience gets there instantly.",
  },
] as const;

export default async function Home(): Promise<React.ReactNode> {
  const { userId } = await auth();

  // Middleware will redirect authenticated users, but we check here for safety
  if (userId) {
    return null;
  }

  return (
    <div className="min-h-screen bg-slate-950">
      {/* Hero Section */}
      <section className="flex flex-col items-center justify-center py-24 px-6 text-center">
        <div className="max-w-4xl mx-auto space-y-8">
          <div className="inline-flex items-center gap-2 rounded-full bg-slate-800 border border-slate-700 px-4 py-1.5 text-sm text-gray-400">
            <Zap className="w-3.5 h-3.5 text-yellow-400" aria-hidden="true" />
            Fast, simple link shortening
          </div>
          <h1 className="text-5xl md:text-7xl font-bold text-white leading-tight tracking-tight">
            Shorten Links,{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-cyan-400">
              Share Smarter
            </span>
          </h1>
          <p className="text-xl text-gray-400 max-w-2xl mx-auto leading-relaxed">
            Transform long, complex URLs into short, memorable links. Manage
            your links and share with confidence.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <SignUpButton mode="modal">
              <Button className="px-8 py-3 h-auto text-base font-semibold">
                Get Started Free
              </Button>
            </SignUpButton>
            <SignInButton mode="modal">
              <Button
                variant="outline"
                className="px-8 py-3 h-auto text-base font-semibold"
              >
                Sign In
              </Button>
            </SignInButton>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-14 space-y-3">
            <h2 className="text-3xl md:text-4xl font-bold text-white">
              Everything You Need
            </h2>
            <p className="text-gray-400 text-lg max-w-xl mx-auto">
              A complete link management solution designed for simplicity and
              power.
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((feature) => (
              <div
                key={feature.title}
                className="bg-slate-900 border border-slate-800 rounded-xl p-6 hover:border-slate-600 transition-colors"
              >
                <feature.icon
                  className="w-8 h-8 text-blue-400 mb-4"
                  aria-hidden="true"
                />
                <h3 className="text-white font-semibold text-lg mb-2">
                  {feature.title}
                </h3>
                <p className="text-gray-400 text-sm leading-relaxed">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-20 px-6 bg-slate-900/50">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-14 space-y-3">
            <h2 className="text-3xl md:text-4xl font-bold text-white">
              How It Works
            </h2>
            <p className="text-gray-400 text-lg">
              Get started in three simple steps.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {steps.map((step) => (
              <div key={step.number} className="text-center space-y-4">
                <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-blue-500/10 border border-blue-500/30 text-blue-400 text-lg font-bold">
                  {step.number}
                </div>
                <h3 className="text-white font-semibold text-xl">
                  {step.title}
                </h3>
                <p className="text-gray-400 text-sm leading-relaxed">
                  {step.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 px-6 text-center">
        <div className="max-w-2xl mx-auto space-y-6">
          <h2 className="text-3xl md:text-4xl font-bold text-white">
            Ready to Get Started?
          </h2>
          <p className="text-gray-400 text-lg">
            Join thousands of users shortening and sharing their links today.
          </p>
          <SignUpButton mode="modal">
            <Button className="px-8 py-3 h-auto text-base font-semibold">
              Create Your Free Account
            </Button>
          </SignUpButton>
        </div>
      </section>
    </div>
  );
}
