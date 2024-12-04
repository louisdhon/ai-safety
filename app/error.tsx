"use client";

import { useEffect } from "react";
import { AlertTriangle } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <Alert variant="destructive" className="my-4">
      <AlertTriangle className="h-4 w-4" />
      <AlertTitle>Something went wrong</AlertTitle>
      <AlertDescription className="mt-2">
        {error.message || "An unexpected error occurred"}
      </AlertDescription>
      <Button
        variant="outline"
        className="mt-4"
        onClick={() => reset()}
      >
        Try again
      </Button>
    </Alert>
  );
}