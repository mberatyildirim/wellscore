"use client";

// HR Signup Page - Company Registration
// Creates company + HR admin account
import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import Link from "next/link";
import { ArrowLeft, Building2, Mail, Lock, User, Briefcase, Users } from "lucide-react";
import { toast } from "sonner";

export default function HRSignupPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  
  // Company info
  const [companyName, setCompanyName] = useState("");
  const [industry, setIndustry] = useState("");
  const [employeeCount, setEmployeeCount] = useState("");
  
  // HR Admin info
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validation
    if (password !== confirmPassword) {
      toast.error("Şifreler eşleşmiyor!");
      return;
    }
    
    if (password.length < 6) {
      toast.error("Şifre en az 6 karakter olmalı!");
      return;
    }

    setIsLoading(true);
    const supabase = createClient();

    try {
      // Step 1: Create auth user (HR Admin)
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            full_name: fullName,
            role: 'hr_admin',
          },
        },
      });

      if (authError) throw new Error("Hesap oluşturulamadı: " + authError.message);
      if (!authData.user) throw new Error("Kullanıcı oluşturulamadı");

      const userId = authData.user.id;

      // Step 2: Create company
      const { data: companyData, error: companyError } = await supabase
        .from("companies")
        .insert({
          name: companyName,
          industry,
          employee_count: parseInt(employeeCount) || null,
          subscription_plan: 'trial',
        })
        .select()
        .single();

      if (companyError) throw new Error("Şirket kaydı oluşturulamadı: " + companyError.message);
      if (!companyData) throw new Error("Şirket verisi alınamadı");

      const companyId = companyData.id;

      // Step 3: Create HR admin profile
      const { error: profileError } = await supabase
        .from("profiles")
        .insert({
          id: userId,
          company_id: companyId,
          role: 'hr_admin',
          full_name: fullName,
          email,
          is_active: true,
        });

      if (profileError) throw new Error("Profil oluşturulamadı: " + profileError.message);

      // Success!
      toast.success("Şirket kaydı başarılı! 🎉");
      toast.info("Email adresinizi doğrulayın");
      
      // Redirect to success page
      router.push("/auth/sign-up-success");
      
    } catch (error: any) {
      console.error("[HR Signup Error]:", error);
      toast.error(error.message || "Kayıt sırasında hata oluştu");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen w-full items-center justify-center bg-gradient-to-br from-background via-accent/5 to-background p-6">
      <div className="w-full max-w-2xl">
        {/* Back button */}
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground mb-6 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Ana Sayfaya Dön
        </Link>

        <Card className="border-border bg-card shadow-xl">
          <CardHeader className="text-center pb-8">
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
              <Building2 className="h-8 w-8 text-primary" />
            </div>
            <CardTitle className="text-3xl text-card-foreground">
              Şirket Kaydı
            </CardTitle>
            <CardDescription className="text-muted-foreground">
              Wellscore'a hoş geldiniz! Şirketinizi kaydedin ve çalışanlarınızın wellbeing'ini ölçmeye başlayın.
            </CardDescription>
          </CardHeader>

          <CardContent>
            <form onSubmit={handleSignup} className="space-y-6">
              {/* Company Information */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-foreground flex items-center gap-2">
                  <Building2 className="h-5 w-5" />
                  Şirket Bilgileri
                </h3>

                <div className="space-y-2">
                  <Label htmlFor="companyName">Şirket Adı *</Label>
                  <Input
                    id="companyName"
                    placeholder="Örnek: Acme Corp"
                    value={companyName}
                    onChange={(e) => setCompanyName(e.target.value)}
                    required
                    disabled={isLoading}
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="industry">Sektör</Label>
                    <Select value={industry} onValueChange={setIndustry} disabled={isLoading}>
                      <SelectTrigger>
                        <SelectValue placeholder="Sektör seçin" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Teknoloji">Teknoloji</SelectItem>
                        <SelectItem value="Finans">Finans</SelectItem>
                        <SelectItem value="Sağlık">Sağlık</SelectItem>
                        <SelectItem value="Eğitim">Eğitim</SelectItem>
                        <SelectItem value="Perakende">Perakende</SelectItem>
                        <SelectItem value="Üretim">Üretim</SelectItem>
                        <SelectItem value="Diğer">Diğer</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="employeeCount">Çalışan Sayısı</Label>
                    <Select value={employeeCount} onValueChange={setEmployeeCount} disabled={isLoading}>
                      <SelectTrigger>
                        <SelectValue placeholder="Seçin" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="1-10">1-10</SelectItem>
                        <SelectItem value="11-50">11-50</SelectItem>
                        <SelectItem value="51-200">51-200</SelectItem>
                        <SelectItem value="201-500">201-500</SelectItem>
                        <SelectItem value="500+">500+</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>

              {/* HR Admin Information */}
              <div className="space-y-4 pt-4 border-t border-border">
                <h3 className="text-lg font-semibold text-foreground flex items-center gap-2">
                  <User className="h-5 w-5" />
                  Yönetici Bilgileri
                </h3>

                <div className="space-y-2">
                  <Label htmlFor="fullName">Ad Soyad *</Label>
                  <div className="relative">
                    <User className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="fullName"
                      className="pl-9"
                      placeholder="Adınız Soyadınız"
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      required
                      disabled={isLoading}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email">Email *</Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="email"
                      type="email"
                      className="pl-9"
                      placeholder="hr@sirket.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                      disabled={isLoading}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="password">Şifre *</Label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="password"
                        type="password"
                        className="pl-9"
                        placeholder="••••••••"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                        disabled={isLoading}
                        minLength={6}
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="confirmPassword">Şifre Tekrar *</Label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="confirmPassword"
                        type="password"
                        className="pl-9"
                        placeholder="••••••••"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        required
                        disabled={isLoading}
                        minLength={6}
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Submit Button */}
              <Button
                type="submit"
                className="w-full bg-primary text-primary-foreground hover:bg-primary/90 h-12"
                disabled={isLoading}
              >
                {isLoading ? "Kaydediliyor..." : "Şirketi Kaydet ve Başla"}
              </Button>

              {/* Login Link */}
              <div className="text-center text-sm text-muted-foreground">
                Zaten hesabınız var mı?{" "}
                <Link
                  href="/auth/login"
                  className="text-primary underline underline-offset-4 hover:text-primary/80"
                >
                  Giriş Yapın
                </Link>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

