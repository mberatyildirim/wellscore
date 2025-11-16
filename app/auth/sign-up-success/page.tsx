import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function SignUpSuccessPage() {
  return (
    <div className="flex min-h-screen w-full items-center justify-center bg-background p-6">
      <div className="w-full max-w-md">
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold text-foreground">WellScore</h1>
        </div>
        
        <Card className="border-border bg-card">
          <CardHeader>
            <CardTitle className="text-2xl text-card-foreground">
              Kayıt Başarılı!
            </CardTitle>
            <CardDescription className="text-muted-foreground">
              Email adresinizi kontrol edin
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-sm text-card-foreground">
              Hesabınız başarıyla oluşturuldu. Giriş yapmadan önce lütfen email adresinize gönderilen doğrulama linkine tıklayın.
            </p>
            <Button asChild className="w-full bg-primary text-primary-foreground hover:bg-primary/90">
              <Link href="/auth/login">
                Giriş sayfasına dön
              </Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
