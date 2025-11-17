"use client";

// Universal Login Page - Employee & HR Admin
// Automatically redirects based on user role
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
import { LoadingScreen } from "@/components/ui/loading-screen";
import Link from "next/link";
import { useRouter } from 'next/navigation';
import { useState } from "react";
import { ArrowLeft, Mail, Lock } from 'lucide-react';
import { toast } from "sonner";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    const supabase = createClient();
    setIsLoading(true);
    setError(null);

    try {
      // Step 1: Sign in with Supabase Auth
      const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      
      if (authError) throw new Error(authError.message);
      if (!authData.user) throw new Error("Giriş başarısız");

      // Step 2: Get user profile to check role
      const { data: profile, error: profileError } = await supabase
        .from("profiles")
        .select("role, is_active, full_name")
        .eq("id", authData.user.id)
        .single();

      if (profileError) {
        throw new Error("Profil bulunamadı. Lütfen yöneticinizle iletişime geçin.");
      }

      if (!profile) {
        throw new Error("Kullanıcı profili bulunamadı");
      }

      if (!profile.is_active) {
        await supabase.auth.signOut();
        throw new Error("Hesabınız aktif değil. Lütfen yöneticinizle iletişime geçin.");
      }

      // Step 3: Redirect based on role
      toast.success(`Hoş geldiniz, ${profile.full_name}! 👋`);
      
      // Use window.location for hard redirect (works better in production)
      if (profile.role === "hr_admin") {
        window.location.href = "/hr/dashboard";
      } else {
        window.location.href = "/employee/dashboard";
      }
      
    } catch (error: any) {
      console.error("[Login Error]:", error);
      setError(error.message || "Giriş yaparken hata oluştu");
      toast.error(error.message || "Giriş başarısız");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <LoadingScreen />
      <div className="flex min-h-screen w-full items-center justify-center bg-gradient-to-br from-background via-accent/5 to-background p-6">
      <div className="w-full max-w-md">
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-sm text-gray-600 hover:text-gray-900 mb-6 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Ana Sayfaya Dön
        </Link>
        
        <Card className="border-border bg-white shadow-xl">
          <CardHeader className="text-center pb-6">
            <CardTitle className="text-3xl text-gray-900">
              Giriş Yap
            </CardTitle>
            <CardDescription className="text-gray-600">
              Wellscore hesabınıza giriş yapın
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleLogin} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="email" className="text-gray-700">Email</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <Input
                    id="email"
                    type="email"
                    className="pl-9 text-gray-900"
                    placeholder="email@sirket.com"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    disabled={isLoading}
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="password" className="text-gray-700">Şifre</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <Input
                    id="password"
                    type="password"
                    className="pl-9 text-gray-900"
                    placeholder="••••••••"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    disabled={isLoading}
                  />
                </div>
              </div>
              
                {error && (
                <div className="rounded-lg bg-destructive/10 p-3 text-sm text-destructive">
                  {error}
                </div>
                )}
              
                <Button 
                  type="submit" 
                  className="w-full bg-orange-600 text-white hover:bg-orange-700 h-12" 
                  disabled={isLoading}
                >
                  {isLoading ? "Giriş yapılıyor..." : "Giriş Yap"}
                </Button>

              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <span className="w-full border-t border-border" />
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                  <span className="bg-white px-2 text-gray-500">
                    veya
                  </span>
                </div>
              </div>

              <div className="text-center text-sm">
                <p className="text-gray-600 mb-2">
                  Şirketinizi henüz kaydettiniz mi?
                </p>
                <Link
                  href="/auth/hr-signup"
                  className="text-orange-600 underline underline-offset-4 hover:text-orange-700 font-medium"
                >
                  Şirket Kaydı Yapın
                </Link>
              </div>
            </form>
          </CardContent>
        </Card>

        <p className="mt-4 text-center text-xs text-gray-600">
          Çalışan mısınız? Davet mailinizden şifrenizi oluşturun.
        </p>
        </div>
      </div>
    </>
  );
}
