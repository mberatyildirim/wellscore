"use client";

// Survey form component for Wellscore assessment
// Displays 8 dimensions with 5 questions each (total 40 questions)
// Uses emoji-based Likert scale (1-5) for responses
import { useState } from "react";
import { useRouter } from 'next/navigation';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { WellbeingDimension, SurveyQuestion } from "@/lib/types/database";
import { createClient } from "@/lib/supabase/client";
import { toast } from "sonner";

// Props interface for the survey form component
interface SurveyFormProps {
  dimensions: WellbeingDimension[]; // Array of 8 wellbeing dimensions
  questions: (SurveyQuestion & { 
    wellbeing_dimensions: { name: string; name_tr: string } | null 
  })[]; // Array of 40 questions with dimension info
  userId: string; // Current user's auth ID
}

// Emoji scale for 1-5 Likert responses
const EMOJI_SCALE = [
  { value: 1, emoji: "😟", label: "Hiç katılmıyorum" },
  { value: 2, emoji: "😕", label: "Katılmıyorum" },
  { value: 3, emoji: "😐", label: "Kararsızım" },
  { value: 4, emoji: "🙂", label: "Katılıyorum" },
  { value: 5, emoji: "😊", label: "Tamamen katılıyorum" },
];

export function SurveyForm({ dimensions, questions, userId }: SurveyFormProps) {
  const router = useRouter();
  const [currentDimensionIndex, setCurrentDimensionIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, number>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const currentDimension = dimensions[currentDimensionIndex];
  const currentQuestions = questions.filter(
    (q) => q.dimension_id === currentDimension.id
  );

  const progress = ((currentDimensionIndex + 1) / dimensions.length) * 100;
  const answeredInCurrentDimension = currentQuestions.filter(
    (q) => answers[q.id] !== undefined
  ).length;
  const allCurrentQuestionsAnswered = answeredInCurrentDimension === currentQuestions.length;

  const handleAnswerChange = (questionId: string, score: number) => {
    setAnswers((prev) => ({ ...prev, [questionId]: score }));
  };

  const handleNext = () => {
    if (currentDimensionIndex < dimensions.length - 1) {
      setCurrentDimensionIndex((prev) => prev + 1);
    }
  };

  const handlePrevious = () => {
    if (currentDimensionIndex > 0) {
      setCurrentDimensionIndex((prev) => prev - 1);
    }
  };

  // Handle survey submission
  // Creates survey_response, inserts all answers, calculates dimension scores
  const handleSubmit = async () => {
    setIsSubmitting(true);
    setError(null);
    const supabase = createClient();

    try {
      // Step 1: Get user's profile with company_id
      const { data: userData, error: userError } = await supabase
        .from("profiles")
        .select("company_id")
        .eq("id", userId)
        .single();

      if (userError) throw new Error("Kullanıcı profili bulunamadı: " + userError.message);
      if (!userData?.company_id) throw new Error("Kullanıcı şirket bilgisi eksik");

      const companyId = userData.company_id;

      // Step 2: Calculate overall score (average of all answers)
      const allScores = Object.values(answers);
      const overallScore = allScores.reduce((sum, score) => sum + score, 0) / allScores.length;

      // Step 3: Create survey response record
      const { data: responseData, error: responseError } = await supabase
        .from("survey_responses")
        .insert({
          user_id: userId,
          company_id: companyId,
          overall_score: parseFloat(overallScore.toFixed(1)),
        })
        .select()
        .single();

      if (responseError) throw new Error("Anket kaydı oluşturulamadı: " + responseError.message);
      if (!responseData) throw new Error("Anket yanıtı alınamadı");

      const responseId = responseData.id;

      // Step 4: Prepare answer records with dimension_id
      const answerRecords = Object.entries(answers).map(([questionId, score]) => {
        const question = questions.find(q => q.id === questionId);
        return {
          response_id: responseId,
          question_id: questionId,
          dimension_id: question?.dimension_id,
          answer_value: score,
        };
      });

      // Step 5: Insert all answers
      const { error: answersError } = await supabase
        .from("survey_answers")
        .insert(answerRecords);

      if (answersError) throw new Error("Cevaplar kaydedilemedi: " + answersError.message);

      // Step 6: Calculate and save dimension scores
      const dimensionScores: Record<string, number[]> = {};
      
      answerRecords.forEach(answer => {
        if (answer.dimension_id) {
          if (!dimensionScores[answer.dimension_id]) {
            dimensionScores[answer.dimension_id] = [];
          }
          dimensionScores[answer.dimension_id].push(answer.answer_value);
        }
      });

      const dimensionScoreRecords = Object.entries(dimensionScores).map(([dimensionId, scores]) => ({
        response_id: responseId,
        dimension_id: dimensionId,
        score: parseFloat((scores.reduce((sum, s) => sum + s, 0) / scores.length).toFixed(1)),
      }));

      const { error: scoresError } = await supabase
        .from("dimension_scores")
        .insert(dimensionScoreRecords);

      if (scoresError) throw new Error("Boyut skorları kaydedilemedi: " + scoresError.message);

      // Success!
      toast.success("Anket başarıyla tamamlandı! 🎉");
      router.push("/employee/dashboard");
      
    } catch (err) {
      console.error("[Wellscore] Survey submission error:", err);
      const errorMessage = err instanceof Error ? err.message : "Beklenmeyen bir hata oluştu";
      setError(errorMessage);
      toast.error(errorMessage);
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <div className="flex items-center justify-between text-sm text-muted-foreground">
          <span>
            Boyut {currentDimensionIndex + 1} / {dimensions.length}
          </span>
          <span>{Math.round(progress)}% tamamlandı</span>
        </div>
        <Progress value={progress} className="h-2" />
      </div>

      <Card className="border-border bg-card">
        <CardHeader>
          <CardTitle className="text-2xl text-card-foreground">
            {currentDimension.name_tr}
          </CardTitle>
          <CardDescription className="text-muted-foreground">
            {currentDimension.description}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-8">
          {currentQuestions.map((question, index) => (
            <div key={question.id} className="space-y-3">
              <p className="font-medium text-card-foreground">
                {index + 1}. {question.question_text_tr}
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-3 md:grid-cols-5 gap-3">
                {EMOJI_SCALE.map((option) => (
                  <button
                    key={option.value}
                    type="button"
                    onClick={() => handleAnswerChange(question.id, option.value)}
                    className={`flex flex-col items-center gap-2 rounded-lg border-2 p-4 transition-all hover:scale-105 ${
                      answers[question.id] === option.value
                        ? "border-primary bg-accent"
                        : "border-border bg-background"
                    }`}
                  >
                    <span className="text-3xl">{option.emoji}</span>
                    <span className="text-xs text-center text-muted-foreground font-medium">
                      {option.label}
                    </span>
                  </button>
                ))}
              </div>
            </div>
          ))}
        </CardContent>
      </Card>

      {error && (
        <Card className="border-destructive bg-destructive/10">
          <CardContent className="pt-6">
            <p className="text-sm text-destructive">{error}</p>
          </CardContent>
        </Card>
      )}

      <div className="flex items-center justify-between">
        <Button
          variant="outline"
          onClick={handlePrevious}
          disabled={currentDimensionIndex === 0}
          className="border-border text-foreground"
        >
          Önceki
        </Button>

        {currentDimensionIndex < dimensions.length - 1 ? (
          <Button
            onClick={handleNext}
            disabled={!allCurrentQuestionsAnswered}
            className="bg-primary text-primary-foreground hover:bg-primary/90"
          >
            Sonraki Boyut
          </Button>
        ) : (
          <Button
            onClick={handleSubmit}
            disabled={!allCurrentQuestionsAnswered || isSubmitting}
            className="bg-primary text-primary-foreground hover:bg-primary/90"
          >
            {isSubmitting ? "Gönderiliyor..." : "Anketi Tamamla"}
          </Button>
        )}
      </div>

      <div className="text-center text-sm text-muted-foreground">
        Bu boyuttaki sorular: {answeredInCurrentDimension} / {currentQuestions.length}
      </div>
    </div>
  );
}
