// HR Marketplace Page - Wellbeing Services & Cart System
// HR admins can browse services, add to cart, and request meetings
import { redirect } from 'next/navigation';
import { createClient } from "@/lib/supabase/server";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ShoppingCart, Plus, Send } from "lucide-react";

export default async function MarketplacePage() {
  const supabase = await createClient();

  // Get current user
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    redirect("/auth/login");
  }

  // Check if user is HR admin
  const { data: userData } = await supabase
    .from("profiles")
    .select("role, company_id, full_name")
    .eq("id", user.id)
    .single();

  if (userData?.role !== "hr_admin") {
    redirect("/employee/dashboard");
  }

  const companyId = userData.company_id;

  // Fetch all active marketplace services
  const { data: services } = await supabase
    .from("marketplace_services")
    .select(`
      *,
      wellbeing_dimensions (
        name_tr,
        color
      )
    `)
    .eq("is_active", true)
    .order("created_at", { ascending: false });

  // Fetch cart items for this company
  const { data: cartItems } = await supabase
    .from("cart_items")
    .select(`
      *,
      marketplace_services (
        service_name,
        provider_name,
        price_range
      )
    `)
    .eq("company_id", companyId)
    .eq("status", "in_cart")
    .order("created_at", { ascending: false });

  const cartCount = cartItems?.length || 0;

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="mx-auto max-w-7xl">
        {/* Header */}
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-foreground">
              Wellbeing Marketplace
            </h1>
            <p className="mt-2 text-muted-foreground">
              Çalışanlarınız için wellbeing hizmetlerini keşfedin
            </p>
          </div>
          
          {/* Cart Summary */}
          <Card className="border-primary">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <ShoppingCart className="h-5 w-5 text-primary" />
                <div>
                  <p className="text-sm font-medium">Sepetiniz</p>
                  <p className="text-2xl font-bold text-primary">{cartCount}</p>
                </div>
                {cartCount > 0 && (
                  <Button size="sm" className="ml-4">
                    <Send className="mr-2 h-4 w-4" />
                    Toplantı Talep Et
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Services Grid */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {services && services.length > 0 ? (
            services.map((service: any) => {
              const isInCart = cartItems?.some(item => item.service_id === service.id);
              
              return (
                <Card key={service.id} className="border-border bg-card hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <CardTitle className="text-lg text-card-foreground">
                          {service.service_name}
                        </CardTitle>
                        <CardDescription className="text-sm text-muted-foreground mt-1">
                          {service.provider_name}
                        </CardDescription>
                      </div>
                      {isInCart && (
                        <Badge variant="secondary" className="ml-2">
                          Sepette
                        </Badge>
                      )}
                    </div>
                  </CardHeader>
                  
                  <CardContent className="space-y-4">
                    <p className="text-sm text-muted-foreground line-clamp-3">
                      {service.description}
                    </p>
                    
                    <div className="flex flex-wrap gap-2">
                      {service.category && (
                        <Badge variant="outline">{service.category}</Badge>
                      )}
                      {service.wellbeing_dimensions && (
                        <Badge 
                          style={{ backgroundColor: service.wellbeing_dimensions.color + '20', color: service.wellbeing_dimensions.color }}
                        >
                          {service.wellbeing_dimensions.name_tr}
                        </Badge>
                      )}
                    </div>
                    
                    {service.price_range && (
                      <p className="text-sm font-medium text-primary">
                        💰 {service.price_range}
                      </p>
                    )}
                    
                    <Button 
                      className="w-full" 
                      variant={isInCart ? "secondary" : "default"}
                      disabled={isInCart}
                    >
                      {isInCart ? (
                        <>
                          <ShoppingCart className="mr-2 h-4 w-4" />
                          Sepette
                        </>
                      ) : (
                        <>
                          <Plus className="mr-2 h-4 w-4" />
                          Sepete Ekle
                        </>
                      )}
                    </Button>
                  </CardContent>
                </Card>
              );
            })
          ) : (
            <div className="col-span-full">
              <Card className="border-border bg-card">
                <CardContent className="py-12 text-center">
                  <p className="text-muted-foreground">
                    Henüz hizmet bulunmuyor
                  </p>
                </CardContent>
              </Card>
            </div>
          )}
        </div>

        {/* Cart Section */}
        {cartCount > 0 && (
          <div className="mt-12">
            <h2 className="mb-6 text-2xl font-bold text-foreground">
              Sepetinizdeki Hizmetler ({cartCount})
            </h2>
            
            <div className="grid gap-4">
              {cartItems?.map((item: any) => (
                <Card key={item.id} className="border-border bg-card">
                  <CardContent className="flex items-center justify-between p-4">
                    <div className="flex-1">
                      <h3 className="font-medium text-foreground">
                        {item.marketplace_services?.service_name}
                      </h3>
                      <p className="text-sm text-muted-foreground">
                        {item.marketplace_services?.provider_name} • {item.marketplace_services?.price_range}
                      </p>
                    </div>
                    
                    <Button variant="ghost" size="sm" className="text-destructive">
                      Kaldır
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
            
            <Card className="mt-6 border-primary bg-accent">
              <CardContent className="p-6">
                <h3 className="mb-4 text-lg font-semibold">
                  Toplantı Talep Et
                </h3>
                <p className="mb-4 text-sm text-muted-foreground">
                  Sepetinizdeki hizmetler için detaylı bilgi almak ve fiyat teklifi almak için toplantı talebinde bulunun.
                </p>
                <Button size="lg" className="w-full">
                  <Send className="mr-2 h-5 w-5" />
                  Toplantı Talebi Gönder
                </Button>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
}
