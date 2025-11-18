import { redirect } from 'next/navigation';
import Image from 'next/image';
import { createClient } from "@/lib/supabase/server";
import { SurveyForm } from "@/components/survey/survey-form";

export default async function SurveyPage() {
  const supabase = await createClient();

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    redirect("/auth/login");
  }

  // Check if user already has a recent survey response (within last 30 days)
  const thirtyDaysAgo = new Date();
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

  const { data: recentResponse } = await supabase
    .from("survey_responses")
    .select("id, completed_at")
    .eq("user_id", user.id)
    .gte("completed_at", thirtyDaysAgo.toISOString())
    .order("completed_at", { ascending: false })
    .limit(1)
    .single();

  if (recentResponse) {
    redirect("/employee/dashboard");
  }

  // Fetch all dimensions and questions
  const { data: dimensions } = await supabase
    .from("wellbeing_dimensions")
    .select("*")
    .order("order_index", { ascending: true });

  // Fetch all survey questions with their dimension info
  // Questions are ordered by dimension and their index within each dimension
  const { data: questions } = await supabase
    .from("survey_questions")
    .select("*, wellbeing_dimensions(name, name_tr)")
    .order("order_index", { ascending: true });

  if (!dimensions || !questions) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <div className="max-w-md w-full space-y-4 text-center">
          <h1 className="text-2xl font-bold text-foreground">Anket Verileri Yüklenemedi</h1>
          <p className="text-muted-foreground">
            Veritabanı tablolarını ve başlangıç verilerini oluşturmak için Scripts klasöründeki SQL dosyalarını çalıştırmanız gerekmektedir.
          </p>
          <div className="bg-muted p-4 rounded-lg text-left">
            <p className="text-sm font-mono text-muted-foreground">
              1. Supabase entegrasyonunu kontrol edin<br />
              2. SQL scriptlerini sırayla çalıştırın<br />
              3. Wellbeing dimensions ve questions verilerini ekleyin
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background py-8 px-4">
      <div className="mx-auto max-w-3xl">
        <div className="mb-8 text-center flex flex-col items-center gap-4">
          <Image 
            src="/logo.svg" 
            alt="WellScore Logo" 
            width={64} 
            height={64}
            className="w-16 h-16"
          />
          <div>
          <h1 className="text-3xl font-bold text-foreground">WellScore Değerlendirmesi</h1>
          <p className="mt-2 text-muted-foreground">
            8 boyutta wellbeing durumunuzu değerlendirin (40 soru)
          </p>
          </div>
        </div>
        
        <SurveyForm 
          dimensions={dimensions} 
          questions={questions}
          userId={user.id}
        />
      </div>
    </div>
  );
}
