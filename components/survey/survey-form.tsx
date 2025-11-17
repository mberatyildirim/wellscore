"use client";

// Survey form component for Wellscore assessment
// Displays 40 questions one by one with auto-advance on answer selection
// Uses emoji-based Likert scale (1-5) for responses
import { useState } from "react";
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { WellbeingDimension, SurveyQuestion } from "@/lib/types/database";
import { createClient } from "@/lib/supabase/client";
import { toast } from "sonner";
import { ChevronLeft } from "lucide-react";

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
  // Current question index (0 to 39 for 40 questions)
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  // Store all answers as a map of questionId -> score
  const [answers, setAnswers] = useState<Record<string, number>>({});
  // Loading state for submission
  const [isSubmitting, setIsSubmitting] = useState(false);
  // Error state for displaying errors
  const [error, setError] = useState<string | null>(null);

  // Get the current question being displayed
  const currentQuestion = questions[currentQuestionIndex];
  // Find the dimension for the current question
  const currentDimension = dimensions.find(d => d.id === currentQuestion?.dimension_id);

  // Calculate rotation angle based on dimension index (0° to 157.5° in 22.5° increments)
  const dimensionIndex = dimensions.findIndex(d => d.id === currentQuestion?.dimension_id);
  const rotationAngle = dimensionIndex >= 0 ? dimensionIndex * 22.5 : 0;
  
  // Calculate progress percentage based on answered questions
  const progress = ((currentQuestionIndex + 1) / questions.length) * 100;
  // Check if all questions have been answered
  const allQuestionsAnswered = Object.keys(answers).length === questions.length;

  // Handle answer selection and auto-advance to next question
  const handleAnswerChange = (questionId: string, score: number) => {
    // Save the answer
    setAnswers((prev) => ({ ...prev, [questionId]: score }));
    
    // Auto-advance to next question after a short delay for UX
    setTimeout(() => {
      if (currentQuestionIndex < questions.length - 1) {
        setCurrentQuestionIndex((prev) => prev + 1);
    }
    }, 300);
  };

  // Navigate to previous question
  const handlePrevious = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex((prev) => prev - 1);
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
    <div className="space-y-4 md:space-y-6">
      {/* Progress Bar - Always visible */}
      <div className="space-y-2">
        <Progress value={progress} className="h-2" />
        <div className="flex items-center justify-center text-xs md:text-sm text-muted-foreground">
          <span>Soru {currentQuestionIndex + 1} / {questions.length}</span>
        </div>
      </div>

      {/* Single Question Card */}
      <Card className="border-border bg-card">
        <CardHeader className="pb-4">
          <div className="flex items-start gap-4">
            {/* Rotated Logo for Dimension - rotation changes per dimension */}
            <div className="flex-shrink-0">
              <Image 
                src="/logo-variant.svg" 
                alt="Dimension Icon" 
                width={48} 
                height={48}
                className="w-10 h-10 md:w-12 md:h-12"
                style={{ transform: `rotate(${rotationAngle}deg)` }}
              />
            </div>
            
            <div className="flex-1">
              {/* Dimension name - hidden on mobile */}
              <div className="hidden md:block">
                <CardTitle className="text-lg md:text-xl text-orange-600">
                  {currentDimension?.name_tr}
          </CardTitle>
                <CardDescription className="text-muted-foreground text-sm mt-1">
                  {currentDimension?.description}
          </CardDescription>
              </div>
              
              {/* Only show dimension name on mobile, no description */}
              <div className="block md:hidden">
                <CardTitle className="text-base text-orange-600">
                  {currentDimension?.name_tr}
                </CardTitle>
              </div>
            </div>
          </div>
        </CardHeader>
        
        <CardContent className="space-y-6">
          {/* Question Text */}
          <div className="bg-orange-50 rounded-lg p-4 md:p-6">
            <p className="font-semibold text-base md:text-lg text-card-foreground text-center">
              {currentQuestion?.question_text_tr}
              </p>
          </div>

          {/* Answer Options - Horizontal layout with emoji + text */}
          <div className="flex flex-col gap-2 md:gap-3">
                {EMOJI_SCALE.map((option) => (
                  <button
                    key={option.value}
                    type="button"
                onClick={() => handleAnswerChange(currentQuestion.id, option.value)}
                className={`flex items-center gap-3 md:gap-4 rounded-lg border-2 px-4 py-2.5 md:py-3 transition-all hover:scale-[1.02] active:scale-95 ${
                  answers[currentQuestion.id] === option.value
                    ? "border-orange-600 bg-orange-50 shadow-md"
                    : "border-border bg-background hover:border-orange-300"
                    }`}
                  >
                <span className="text-2xl md:text-3xl flex-shrink-0">{option.emoji}</span>
                <span className="text-sm md:text-base text-left text-muted-foreground font-medium flex-1">
                      {option.label}
                    </span>
                  </button>
                ))}
              </div>
        </CardContent>
      </Card>

      {/* Error Display */}
      {error && (
        <Card className="border-destructive bg-destructive/10">
          <CardContent className="pt-4 md:pt-6">
            <p className="text-xs md:text-sm text-destructive text-center">{error}</p>
          </CardContent>
        </Card>
      )}

      {/* Navigation Buttons */}
      <div className="flex items-center justify-between gap-3">
        {/* Previous Button - Always visible but disabled on first question */}
        <Button
          variant="outline"
          onClick={handlePrevious}
          disabled={currentQuestionIndex === 0}
          className="border-border text-foreground text-xs md:text-base px-3 md:px-4 py-2 md:py-2.5"
          size="sm"
        >
          <ChevronLeft className="w-4 h-4 mr-1" />
          Önceki
        </Button>

        {/* Submit Button - Only show on last question if all answered */}
        {currentQuestionIndex === questions.length - 1 && allQuestionsAnswered && (
          <Button
            onClick={handleSubmit}
            disabled={isSubmitting}
            className="bg-orange-600 text-white hover:bg-orange-700 text-xs md:text-base px-4 md:px-6 py-2 md:py-2.5"
            size="sm"
          >
            {isSubmitting ? "Gönderiliyor..." : "Anketi Tamamla"}
          </Button>
        )}
      </div>
    </div>
  );
}
