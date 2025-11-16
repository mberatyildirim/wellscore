import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default async function ErrorPage({
  searchParams,
}: {
  searchParams: Promise<{ error: string }>;
}) {
  const params = await searchParams;

  return (
    <div className="flex min-h-screen w-full items-center justify-center bg-background p-6">
      <div className="w-full max-w-md">
        <Card className="border-border bg-card">
          <CardHeader>
            <CardTitle className="text-2xl text-destructive">
              Bir hata oluştu
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {params?.error ? (
              <p className="text-sm text-muted-foreground">
                Hata kodu: {params.error}
              </p>
            ) : (
              <p className="text-sm text-muted-foreground">
                Beklenmeyen bir hata oluştu.
              </p>
            )}
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
