'use client';

// Test button for generating AI recommendations manually
import { useState } from 'react';
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { Sparkles, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { useRouter } from 'next/navigation';

export function TestAIRecommendationsButton() {
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleTest = async () => {
    setIsLoading(true);
    const supabase = createClient();

    try {
      // Get current user
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        toast.error("Giriş yapmanız gerekiyor");
        return;
      }

      // Get latest survey response
      const { data: latestResponse, error: responseError } = await supabase
        .from("survey_responses")
        .select("id")
        .eq("user_id", user.id)
        .order("completed_at", { ascending: false })
        .limit(1)
        .single();

      if (responseError || !latestResponse) {
        toast.error("Önce bir anket tamamlamanız gerekiyor");
        return;
      }

      // Call AI recommendations API
      const response = await fetch("/api/generate-ai-recommendations", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ responseId: latestResponse.id }),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || "AI önerileri oluşturulamadı");
      }

      toast.success("✅ AI önerileri başarıyla oluşturuldu!");
      
      // Refresh page to show new recommendations
      setTimeout(() => {
        router.refresh();
        router.push("/employee/ai-recommendations");
      }, 1000);

    } catch (error: any) {
      console.error("[Test AI Recommendations Error]:", error);
      toast.error(error.message || "AI önerileri oluşturulamadı");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Button
      onClick={handleTest}
      disabled={isLoading}
      variant="outline"
      className="w-full border-orange-500 text-orange-600 hover:bg-orange-50"
    >
      {isLoading ? (
        <>
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          AI Önerileri Oluşturuluyor...
        </>
      ) : (
        <>
          <Sparkles className="mr-2 h-4 w-4" />
          AI Önerileri Oluştur (Test)
        </>
      )}
    </Button>
  );
}

