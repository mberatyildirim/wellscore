'use client';

// Password Reset Page - For employee invitations
// Allows new employees to set their password
import { useState, useEffect } from 'react';
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { LoadingScreen } from "@/components/ui/loading-screen";
import { useRouter } from 'next/navigation';
import { toast } from "sonner";
import { Lock, CheckCircle, Eye, EyeOff } from 'lucide-react';

export default function ResetPasswordPage() {
  const router = useRouter();
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [isValidToken, setIsValidToken] = useState(false);

  useEffect(() => {
    // Check if there's a valid session
    const checkSession = async () => {
      const supabase = createClient();
      const { data: { session } } = await supabase.auth.getSession();
      
      if (session) {
        setIsValidToken(true);
      } else {
        // Wait a bit for the callback route to process
        setTimeout(async () => {
          const { data: { session: retrySession } } = await supabase.auth.getSession();
          if (retrySession) {
            setIsValidToken(true);
          } else {
            toast.error('Geçersiz veya süresi dolmuş davet linki');
          }
        }, 1000);
      }
    };

    checkSession();
  }, []);

  const handlePasswordReset = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate passwords
    if (password.length < 8) {
      toast.error('Şifre en az 8 karakter olmalıdır');
      return;
    }

    if (password !== confirmPassword) {
      toast.error('Şifreler eşleşmiyor');
      return;
    }

    setIsLoading(true);

    try {
      const supabase = createClient();

      // Update password
      const { error } = await supabase.auth.updateUser({
        password: password,
      });

      if (error) throw error;

      // Get user profile to redirect to correct dashboard
      const { data: { user } } = await supabase.auth.getUser();
      
      if (user) {
        const { data: profile } = await supabase
          .from('profiles')
          .select('role, full_name')
          .eq('id', user.id)
          .single();

        toast.success('Şifreniz başarıyla oluşturuldu! 🎉');
        
        // Redirect based on role (hard redirect for production)
        setTimeout(() => {
          if (profile?.role === 'hr_admin') {
            window.location.href = '/hr/dashboard';
          } else {
            window.location.href = '/employee/dashboard';
          }
        }, 1000);
      } else {
        // Fallback to login
        toast.success('Şifreniz başarıyla oluşturuldu! Giriş yapabilirsiniz.');
        setTimeout(() => {
          window.location.href = '/auth/login';
        }, 1500);
      }

    } catch (error: any) {
      console.error('[Password Reset Error]:', error);
      toast.error(error.message || 'Şifre oluşturulurken hata oluştu');
    } finally {
      setIsLoading(false);
    }
  };

  if (!isValidToken) {
    return (
      <>
        <LoadingScreen />
        <div className="flex min-h-screen w-full items-center justify-center bg-white p-4 sm:p-6">
          <Card className="w-full max-w-md border-red-200 bg-red-50">
            <CardHeader className="text-center">
              <CardTitle className="text-2xl text-red-600">Geçersiz Link</CardTitle>
              <CardDescription>
                Davet linkiniz geçersiz veya süresi dolmuş. Lütfen yöneticinizle iletişime geçin.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button asChild variant="outline" className="w-full">
                <a href="/auth/login">Giriş Sayfasına Dön</a>
              </Button>
            </CardContent>
          </Card>
        </div>
      </>
    );
  }

  return (
    <>
      <LoadingScreen />
      <div className="flex min-h-screen w-full items-center justify-center bg-white p-4 sm:p-6">
        <div className="w-full max-w-md">
        <Card className="border-border bg-white shadow-xl">
          <CardHeader className="text-center pb-6">
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-orange-100">
              <Lock className="h-8 w-8 text-orange-600" />
            </div>
            <CardTitle className="text-3xl text-gray-900">
              Şifrenizi Oluşturun
            </CardTitle>
            <CardDescription className="text-gray-600">
              Wellscore'a hoş geldiniz! Hesabınız için güvenli bir şifre oluşturun.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handlePasswordReset} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="password" className="text-gray-700">Yeni Şifre</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    className="pl-9 pr-10 text-gray-900"
                    placeholder="En az 8 karakter"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    disabled={isLoading}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-3 text-gray-400 hover:text-gray-600"
                  >
                    {showPassword ? (
                      <EyeOff className="h-4 w-4" />
                    ) : (
                      <Eye className="h-4 w-4" />
                    )}
                  </button>
                </div>
                <p className="text-xs text-gray-500">
                  Şifreniz en az 8 karakter içermelidir
                </p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="confirm-password" className="text-gray-700">Şifre Tekrar</Label>
                <div className="relative">
                  <CheckCircle className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <Input
                    id="confirm-password"
                    type={showPassword ? "text" : "password"}
                    className="pl-9 text-gray-900"
                    placeholder="Şifrenizi tekrar girin"
                    required
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    disabled={isLoading}
                  />
                </div>
              </div>

              {password && confirmPassword && password !== confirmPassword && (
                <div className="rounded-lg bg-red-50 p-3 text-sm text-red-600">
                  Şifreler eşleşmiyor
                </div>
              )}

              {password && confirmPassword && password === confirmPassword && (
                <div className="rounded-lg bg-green-50 p-3 text-sm text-green-600">
                  ✓ Şifreler eşleşiyor
                </div>
              )}

              <Button 
                type="submit" 
                className="w-full bg-orange-600 text-white hover:bg-orange-700 h-12" 
                disabled={isLoading || password !== confirmPassword}
              >
                {isLoading ? "Kaydediliyor..." : "Şifre Oluştur ve Giriş Yap"}
              </Button>
            </form>
          </CardContent>
        </Card>

        <p className="mt-4 text-center text-xs text-gray-600">
          Şifrenizi oluşturduktan sonra sisteme giriş yapabileceksiniz
        </p>
        </div>
      </div>
    </>
  );
}

