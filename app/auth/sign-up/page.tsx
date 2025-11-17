"use client";

import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import Link from "next/link";
import { useRouter } from 'next/navigation';
import { useState } from "react";
import { ArrowLeft, Loader2 } from 'lucide-react';

export default function SignUpPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [repeatPassword, setRepeatPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [companyName, setCompanyName] = useState("");
  const [role, setRole] = useState<"employee" | "hr_admin">("employee");
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    const supabase = createClient();
    setIsLoading(true);
    setError(null);

    if (password !== repeatPassword) {
      setError("Şifreler eşleşmiyor");
      setIsLoading(false);
      return;
    }

    if (password.length < 6) {
      setError("Şifre en az 6 karakter olmalıdır");
      setIsLoading(false);
      return;
    }

    try {
      // First create or find company
      let companyId = null;
      
      if (role === "hr_admin") {
        const { data: existingCompany } = await supabase
          .from("companies")
          .select("id")
          .eq("name", companyName)
          .single();

        if (existingCompany) {
          companyId = existingCompany.id;
        } else {
          const { data: newCompany, error: companyError } = await supabase
            .from("companies")
            .insert({ name: companyName })
            .select()
            .single();

          if (companyError) throw companyError;
          companyId = newCompany.id;
        }
      }

      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: `${window.location.origin}/auth/welcome`,
          data: {
            full_name: fullName,
            role: role,
            company_id: companyId,
          },
        },
      });
      
      if (error) throw error;
      router.push("/auth/sign-up-success");
    } catch (error: unknown) {
      setError(error instanceof Error ? error.message : "Bir hata oluştu");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen w-full items-center justify-center bg-background p-6">
      {isLoading && (
        <div className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50 flex items-center justify-center">
          <div className="flex flex-col items-center gap-4">
            <Loader2 className="w-12 h-12 animate-spin text-orange-600" />
            <p className="text-lg font-medium text-foreground">Hesap oluşturuluyor...</p>
          </div>
        </div>
      )}
      
      <div className="w-full max-w-md">
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground mb-6 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Ana Sayfaya Dön
        </Link>
        
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold text-foreground">WellScore</h1>
          <p className="mt-2 text-sm text-muted-foreground">
            Kurumsal wellbeing analiz platformu
          </p>
        </div>
        
        <Card className="border-border bg-card">
          <CardHeader>
            <CardTitle className="text-2xl text-card-foreground">Kayıt Ol</CardTitle>
            <CardDescription className="text-muted-foreground">
              Yeni hesap oluşturun
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSignUp}>
              <div className="flex flex-col gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="fullName" className="text-card-foreground">Ad Soyad</Label>
                  <Input
                    id="fullName"
                    type="text"
                    placeholder="Ahmet Yılmaz"
                    required
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    className="border-input bg-background text-foreground"
                  />
                </div>
                
                <div className="grid gap-2">
                  <Label htmlFor="role" className="text-card-foreground">Rol</Label>
                  <Select value={role} onValueChange={(value: "employee" | "hr_admin") => setRole(value)}>
                    <SelectTrigger className="border-input bg-background text-foreground">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="employee">Çalışan</SelectItem>
                      <SelectItem value="hr_admin">İK Yöneticisi</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {role === "hr_admin" && (
                  <div className="grid gap-2">
                    <Label htmlFor="companyName" className="text-card-foreground">Şirket Adı</Label>
                    <Input
                      id="companyName"
                      type="text"
                      placeholder="Şirket A.Ş."
                      required
                      value={companyName}
                      onChange={(e) => setCompanyName(e.target.value)}
                      className="border-input bg-background text-foreground"
                    />
                  </div>
                )}

                <div className="grid gap-2">
                  <Label htmlFor="email" className="text-card-foreground">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="ornek@sirket.com"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="border-input bg-background text-foreground"
                  />
                </div>
                
                <div className="grid gap-2">
                  <Label htmlFor="password" className="text-card-foreground">Şifre</Label>
                  <Input
                    id="password"
                    type="password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="border-input bg-background text-foreground"
                  />
                </div>
                
                <div className="grid gap-2">
                  <Label htmlFor="repeat-password" className="text-card-foreground">Şifre Tekrar</Label>
                  <Input
                    id="repeat-password"
                    type="password"
                    required
                    value={repeatPassword}
                    onChange={(e) => setRepeatPassword(e.target.value)}
                    className="border-input bg-background text-foreground"
                  />
                </div>
                
                {error && (
                  <p className="text-sm text-destructive">{error}</p>
                )}
                
                <Button 
                  type="submit" 
                  className="w-full bg-primary text-primary-foreground hover:bg-primary/90" 
                  disabled={isLoading}
                >
                  {isLoading ? "Hesap oluşturuluyor..." : "Kayıt Ol"}
                </Button>
              </div>
              <div className="mt-4 text-center text-sm text-muted-foreground">
                Zaten hesabınız var mı?{" "}
                <Link
                  href="/auth/login"
                  className="text-primary underline underline-offset-4 hover:text-primary/80"
                >
                  Giriş yap
                </Link>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
