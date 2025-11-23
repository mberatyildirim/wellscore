'use client';

// Test button for survey-complete onboarding page
import { useState } from 'react';
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { Sparkles, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { useRouter } from 'next/navigation';

interface TestSurveyCompleteButtonProps {
  responseId?: string;
}

export function TestSurveyCompleteButton({ responseId }: TestSurveyCompleteButtonProps) {
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleTest = async () => {
    setIsLoading(true);
    const supabase = createClient();

    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        toast.error("Giriş yapmanız gerekiyor");
        return;
      }

      let finalResponseId = responseId;

      // If no responseId provided, get latest survey response
      if (!finalResponseId) {
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

        finalResponseId = latestResponse.id;
      }

      // Check if AI recommendations exist, if not generate them
      const { data: profile } = await supabase
        .from("profiles")
        .select("ai_recommendations")
        .eq("id", user.id)
        .single();

      if (!profile?.ai_recommendations) {
        toast.info("AI önerileri oluşturuluyor...");
        
        const aiResponse = await fetch("/api/generate-ai-recommendations", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ responseId: finalResponseId }),
        });

        if (!aiResponse.ok) {
          toast.warning("AI önerileri oluşturulamadı, yine de sayfaya yönlendiriliyorsunuz");
        } else {
          toast.success("AI önerileri hazır!");
        }
      }

      // Navigate to survey-complete page
      router.push(`/employee/survey-complete?responseId=${finalResponseId}`);

    } catch (error: any) {
      console.error("[Test Survey Complete Error]:", error);
      toast.error(error.message || "Sayfa açılamadı");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Button
      onClick={handleTest}
      disabled={isLoading}
      variant="outline"
      className="w-full border-blue-500 text-blue-600 hover:bg-blue-50 text-xs"
      size="sm"
    >
      {isLoading ? (
        <>
          <Loader2 className="mr-2 h-3 w-3 animate-spin" />
          Hazırlanıyor...
        </>
      ) : (
        <>
          <Sparkles className="mr-2 h-3 w-3" />
          Survey Complete Test (Onboarding)
        </>
      )}
    </Button>
  );
}

