"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { useRouter } from 'next/navigation';

export function GenerateHRActionsButton() {
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleGenerate = async () => {
    setIsLoading(true);
    try {
      const response = await fetch("/api/generate-hr-actions", {
        method: "POST",
      });

      if (response.ok) {
        router.refresh();
      }
    } catch (error) {
      console.error("Failed to generate actions:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Button
      onClick={handleGenerate}
      disabled={isLoading}
      className="bg-primary text-primary-foreground hover:bg-primary/90"
    >
      {isLoading ? "Aksiyonlar Oluşturuluyor..." : "AI Aksiyon Planları Oluştur"}
    </Button>
  );
}
