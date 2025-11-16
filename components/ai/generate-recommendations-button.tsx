"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { useRouter } from 'next/navigation';

export function GenerateRecommendationsButton({ responseId }: { responseId: string }) {
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleGenerate = async () => {
    setIsLoading(true);
    try {
      const response = await fetch("/api/generate-employee-recommendations", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ responseId }),
      });

      if (response.ok) {
        router.refresh();
      }
    } catch (error) {
      console.error("Failed to generate recommendations:", error);
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
      {isLoading ? "Öneriler Oluşturuluyor..." : "AI Önerileri Oluştur"}
    </Button>
  );
}
