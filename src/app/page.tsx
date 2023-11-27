import logo from "@/assets/logo.png";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { auth } from "@clerk/nextjs";
import { redirect } from "next/navigation";

export default function Home() {
  const { userId } = auth();

  if (userId) redirect("/notes");

  return (
    <main className="flex h-screen flex-col items-center justify-center gap-5">
      <div className="flex items-center gap-4">
        <Image src={logo} alt="Notik Logo" width={100} height={100} />
        <span className="tracking tracking-t text-4xl font-extrabold tracking-tight lg:text-5xl">
          Notik
        </span>
      </div>
      <p className="max-w-prose text-center">
        An intelligent note-taking app with AI integration, built with OpenAI,
        Pinecone, Next.js, MongoDB, Shadcn UI, Clerk, and more.
      </p>
      <Button asChild={true} size="lg">
        <Link href="/notes">Open</Link>
      </Button>
    </main>
  );
}
