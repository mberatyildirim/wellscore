"use client";

// Survey form component for Wellscore assessment
// Displays 50 questions one by one with auto-advance on answer selection
// Uses emoji-based Likert scale (1-5) for responses
// Enhanced with smooth animations, better state management, and improved UX
import { useState, useEffect, useRef, useCallback } from "react";
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { WellbeingDimension, SurveyQuestion } from "@/lib/types/database";
import { createClient } from "@/lib/supabase/client";
import { toast } from "sonner";
import { ChevronLeft, CheckCircle2 } from "lucide-react";

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
  // Current question index (0 to 49 for 50 questions)
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  // Store all answers as a map of questionId -> score
  const [answers, setAnswers] = useState<Record<string, number>>({});
  // Loading state for submission
  const [isSubmitting, setIsSubmitting] = useState(false);
  // Error state for displaying errors
  const [error, setError] = useState<string | null>(null);
  // Animation state for smooth transitions
  const [isTransitioning, setIsTransitioning] = useState(false);
  // Track if answer was just selected (for visual feedback)
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  // State to prevent double-clicks (using state instead of ref for better reactivity)
  const [isProcessing, setIsProcessing] = useState(false);

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

  // Reset transition state when question changes
  useEffect(() => {
    setIsTransitioning(false);
    setSelectedAnswer(null);
    // Reset processing flag when question changes
    setIsProcessing(false);
  }, [currentQuestionIndex]);

  // Handle answer selection with improved state management
  const handleAnswerChange = useCallback((questionId: string, score: number) => {
    // Prevent double-clicks and rapid clicks
    if (isProcessing) return;
    
    setIsProcessing(true);
    setSelectedAnswer(score);
    
    // Immediately save the answer to state
    setAnswers((prev) => {
      const newAnswers = { ...prev, [questionId]: score };
      return newAnswers;
    });

    // Check if this is the last question
    const isLastQuestion = currentQuestionIndex === questions.length - 1;
    
    if (isLastQuestion) {
      // If last question, don't transition - just reset states and show submit button
      setTimeout(() => {
        setIsTransitioning(false);
        setIsProcessing(false);
        setSelectedAnswer(null);
      }, 300); // Short delay for visual feedback
    } else {
      // Start transition animation for non-last questions
      setIsTransitioning(true);
      
      // Auto-advance to next question after animation delay
      setTimeout(() => {
        if (currentQuestionIndex < questions.length - 1) {
          setCurrentQuestionIndex((prev) => prev + 1);
        }
      }, 400); // Slightly longer delay for better UX
    }
  }, [currentQuestionIndex, questions.length, isProcessing]);

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
      {/* Enhanced Progress Bar with answered count */}
      <div className="space-y-3">
        <div className="flex items-center justify-between text-xs md:text-sm text-muted-foreground mb-1">
          <span className="font-medium">İlerleme</span>
          <span className="font-semibold text-orange-600">
            {Object.keys(answers).length} / {questions.length} cevaplandı
          </span>
        </div>
        <Progress 
          value={progress} 
          className="h-3 bg-gray-100"
        />
        <div className="flex items-center justify-center text-xs md:text-sm text-muted-foreground">
          <span className="font-medium">Soru {currentQuestionIndex + 1} / {questions.length}</span>
        </div>
      </div>

      {/* Single Question Card with smooth transitions */}
      <div 
        className={`transition-all duration-300 ${
          isTransitioning ? 'opacity-0 translate-x-4' : 'opacity-100 translate-x-0'
        }`}
      >
        <Card className="border-2 border-orange-200 bg-card shadow-lg hover:shadow-xl transition-shadow">
          <CardHeader className="pb-4">
            <div className="flex items-start gap-4">
              {/* Rotated Logo for Dimension with smooth rotation */}
              <div className="flex-shrink-0">
                <div 
                  className="transition-transform duration-500 ease-in-out"
                  style={{ transform: `rotate(${rotationAngle}deg)` }}
                >
                  <Image 
                    src="/logo-variant.svg" 
                    alt="Dimension Icon" 
                    width={56} 
                    height={56}
                    className="w-12 h-12 md:w-14 md:h-14"
                  />
                </div>
              </div>
              
              <div className="flex-1">
                {/* Dimension name - hidden on mobile */}
                <div className="hidden md:block">
                  <CardTitle className="text-xl md:text-2xl text-orange-600 font-bold">
                    {currentDimension?.name_tr}
                  </CardTitle>
                  <CardDescription className="text-muted-foreground text-sm mt-2">
                    {currentDimension?.description}
                  </CardDescription>
                </div>
                
                {/* Only show dimension name on mobile, no description */}
                <div className="block md:hidden">
                  <CardTitle className="text-lg text-orange-600 font-bold">
                    {currentDimension?.name_tr}
                  </CardTitle>
                </div>
              </div>
            </div>
          </CardHeader>
          
          <CardContent className="space-y-6">
            {/* Question Text with enhanced styling */}
            <div className="bg-gradient-to-br from-orange-50 to-orange-100 rounded-xl p-5 md:p-7 border border-orange-200 shadow-sm">
              <p className="font-semibold text-base md:text-xl text-gray-900 text-center leading-relaxed">
                {currentQuestion?.question_text_tr}
              </p>
            </div>

            {/* Answer Options - Enhanced with better animations and feedback */}
            <div className="flex flex-col gap-3 md:gap-4">
              {EMOJI_SCALE.map((option) => {
                const isSelected = answers[currentQuestion.id] === option.value;
                const isJustSelected = selectedAnswer === option.value && isSelected;
                
                return (
                  <button
                    key={option.value}
                    type="button"
                    onClick={() => handleAnswerChange(currentQuestion.id, option.value)}
                    disabled={isProcessing}
                    className={`
                      flex items-center gap-4 rounded-xl border-2 px-5 py-4 md:py-5 
                      transition-all duration-200 ease-in-out
                      transform
                      ${isSelected 
                        ? "border-orange-600 bg-gradient-to-r from-orange-50 to-orange-100 shadow-lg scale-[1.02] ring-2 ring-orange-200" 
                        : "border-gray-200 bg-white hover:border-orange-400 hover:bg-orange-50 hover:shadow-md hover:scale-[1.01]"
                      }
                      ${isJustSelected ? "animate-pulse" : ""}
                      active:scale-95
                      disabled:opacity-50 disabled:cursor-not-allowed
                    `}
                  >
                    <span className="text-3xl md:text-4xl flex-shrink-0 transition-transform duration-200">
                      {option.emoji}
                    </span>
                    <span className={`
                      text-sm md:text-base text-left font-medium flex-1
                      ${isSelected ? "text-orange-900" : "text-gray-700"}
                    `}>
                      {option.label}
                    </span>
                    {isSelected && (
                      <CheckCircle2 className="h-5 w-5 md:h-6 md:w-6 text-orange-600 flex-shrink-0 animate-in fade-in zoom-in duration-200" />
                    )}
                  </button>
                );
              })}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Error Display */}
      {error && (
        <Card className="border-destructive bg-destructive/10">
          <CardContent className="pt-4 md:pt-6">
            <p className="text-xs md:text-sm text-destructive text-center">{error}</p>
          </CardContent>
        </Card>
      )}

      {/* Navigation Buttons - Enhanced */}
      <div className="flex items-center justify-between gap-3 pt-2">
        {/* Previous Button - Always visible but disabled on first question */}
        <Button
          variant="outline"
          onClick={handlePrevious}
          disabled={currentQuestionIndex === 0 || isProcessing}
          className="border-2 border-gray-300 text-gray-700 hover:bg-gray-50 hover:border-gray-400 text-xs md:text-base px-4 md:px-6 py-2.5 md:py-3 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          size="sm"
        >
          <ChevronLeft className="w-4 h-4 mr-1" />
          Önceki
        </Button>

        {/* Submit Button - Show on last question when all answered */}
        {currentQuestionIndex === questions.length - 1 && allQuestionsAnswered && !isTransitioning && (
          <Button
            onClick={handleSubmit}
            disabled={isSubmitting || isProcessing}
            className="bg-gradient-to-r from-orange-600 to-orange-700 text-white hover:from-orange-700 hover:to-orange-800 shadow-lg hover:shadow-xl text-xs md:text-base px-6 md:px-8 py-2.5 md:py-3 font-semibold transition-all transform hover:scale-105 active:scale-95 animate-in fade-in slide-in-from-right duration-300"
            size="sm"
          >
            {isSubmitting ? (
              <>
                <span className="animate-spin mr-2">⏳</span>
                Gönderiliyor...
              </>
            ) : (
              <>
                <CheckCircle2 className="w-4 h-4 mr-2" />
                Anketi Tamamla
              </>
            )}
          </Button>
        )}
        
        {/* Show completion status if on last question but not all answered */}
        {currentQuestionIndex === questions.length - 1 && !allQuestionsAnswered && !isTransitioning && (
          <div className="text-xs md:text-sm text-muted-foreground text-right animate-in fade-in slide-in-from-right duration-300">
            <p className="font-medium">Tüm soruları cevaplayın</p>
            <p className="text-orange-600 font-semibold">
              {questions.length - Object.keys(answers).length} soru kaldı
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
