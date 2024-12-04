"use client";

import { Component, ErrorInfo, ReactNode } from "react";
import { AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null,
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error("Uncaught error:", error, errorInfo);
  }

  private getErrorMessage(error: Error | null): string {
    if (!error) return "An unexpected error occurred";

    if (error.message.includes('environment variables')) {
      return "Missing API configuration. Please check your environment variables.";
    }

    if (error.message.includes('OpenAI')) {
      return "Error connecting to OpenAI. Please check your API key.";
    }

    return error.message;
  }

  public render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <Alert variant="destructive" className="my-4">
          <AlertTriangle className="h-4 w-4" />
          <AlertTitle>Something went wrong</AlertTitle>
          <AlertDescription className="mt-2">
            {this.getErrorMessage(this.state.error)}
          </AlertDescription>
          <Button
            variant="outline"
            className="mt-4"
            onClick={() => {
              this.setState({ hasError: false, error: null });
              window.location.reload();
            }}
          >
            Try again
          </Button>
        </Alert>
      );
    }

    return this.props.children;
  }
}