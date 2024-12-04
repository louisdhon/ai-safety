import { FileQuestion } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[400px] text-center">
      <FileQuestion className="h-16 w-16 text-muted-foreground mb-4" />
      <h2 className="text-2xl font-bold tracking-tight mb-2">Page not found</h2>
      <p className="text-muted-foreground mb-6">
        The page you're looking for doesn't exist or has been moved.
      </p>
      <Button asChild>
        <Link href="/">Return Home</Link>
      </Button>
    </div>
  );
}