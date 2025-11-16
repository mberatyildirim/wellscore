'use client';

// HR Employee Invitation Page - PRD Compliant
// Allows HR to invite employees manually or via CSV upload
import { useState } from 'react';
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useRouter } from 'next/navigation';
import { toast } from "sonner";
import { UserPlus, Upload, Mail, User, ArrowLeft, Loader2, CheckCircle, AlertCircle } from 'lucide-react';
import Link from 'next/link';

// Interface for employee invitation
interface EmployeeInvite {
  email: string;
  full_name: string;
  status: 'pending' | 'success' | 'error';
  message?: string;
}

export default function InviteEmployeePage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  
  // Manual invite state
  const [manualEmail, setManualEmail] = useState('');
  const [manualName, setManualName] = useState('');
  
  // CSV upload state
  const [csvFile, setCsvFile] = useState<File | null>(null);
  const [csvEmployees, setCsvEmployees] = useState<EmployeeInvite[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);

  // Handle manual employee invite
  const handleManualInvite = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const supabase = createClient();
      
      // Get current HR user and company
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Oturum bulunamadı');

      const { data: profile } = await supabase
        .from('profiles')
        .select('company_id, role')
        .eq('id', user.id)
        .single();

      if (!profile || profile.role !== 'hr_admin') {
        throw new Error('Yetkiniz yok');
      }

      // Send invitation via API route
      const response = await fetch('/api/invite-employee', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: manualEmail,
          full_name: manualName,
          company_id: profile.company_id,
        }),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || 'Davet gönderilemedi');
      }

      toast.success(`✅ ${manualName} başarıyla davet edildi!`);
      setManualEmail('');
      setManualName('');
      
    } catch (error: any) {
      console.error('[Manual Invite Error]:', error);
      toast.error(error.message || 'Davet gönderilirken hata oluştu');
    } finally {
      setIsLoading(false);
    }
  };

  // Handle CSV file selection
  const handleCsvUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.name.endsWith('.csv')) {
      toast.error('Lütfen geçerli bir CSV dosyası seçin');
      return;
    }

    setCsvFile(file);
    
    // Parse CSV file
    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const text = event.target?.result as string;
        const lines = text.split('\n').filter(line => line.trim());
        
        // Skip header row
        const dataLines = lines.slice(1);
        
        const employees: EmployeeInvite[] = dataLines.map((line, index) => {
          const [email, full_name] = line.split(',').map(s => s.trim());
          
          // Basic validation
          if (!email || !full_name) {
            return {
              email: email || `Satır ${index + 2}`,
              full_name: full_name || 'Geçersiz',
              status: 'error' as const,
              message: 'Eksik bilgi',
            };
          }

          // Email validation
          const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
          if (!emailRegex.test(email)) {
            return {
              email,
              full_name,
              status: 'error' as const,
              message: 'Geçersiz email',
            };
          }

          return {
            email,
            full_name,
            status: 'pending' as const,
          };
        });

        setCsvEmployees(employees);
        toast.success(`${employees.length} çalışan yüklendi`);
        
      } catch (error) {
        console.error('[CSV Parse Error]:', error);
        toast.error('CSV dosyası okunamadı');
      }
    };

    reader.readAsText(file);
  };

  // Process CSV bulk invitations
  const handleBulkInvite = async () => {
    setIsProcessing(true);

    try {
      const supabase = createClient();
      
      // Get current HR user and company
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Oturum bulunamadı');

      const { data: profile } = await supabase
        .from('profiles')
        .select('company_id, role')
        .eq('id', user.id)
        .single();

      if (!profile || profile.role !== 'hr_admin') {
        throw new Error('Yetkiniz yok');
      }

      // Filter valid employees
      const validEmployees = csvEmployees.filter(emp => emp.status === 'pending');
      
      // Process each employee
      for (let i = 0; i < validEmployees.length; i++) {
        const employee = validEmployees[i];
        
        try {
          const response = await fetch('/api/invite-employee', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              email: employee.email,
              full_name: employee.full_name,
              company_id: profile.company_id,
            }),
          });

          const result = await response.json();

          if (response.ok) {
            employee.status = 'success';
            employee.message = 'Davet gönderildi';
          } else {
            employee.status = 'error';
            employee.message = result.error || 'Hata';
          }
          
        } catch (error: any) {
          employee.status = 'error';
          employee.message = error.message || 'Bağlantı hatası';
        }

        // Update UI
        setCsvEmployees([...csvEmployees]);
      }

      const successCount = csvEmployees.filter(e => e.status === 'success').length;
      const errorCount = csvEmployees.filter(e => e.status === 'error').length;

      toast.success(`✅ ${successCount} davet gönderildi, ${errorCount} hata`);
      
    } catch (error: any) {
      console.error('[Bulk Invite Error]:', error);
      toast.error(error.message || 'Toplu davet hatası');
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-accent/5 to-background p-6">
      <div className="mx-auto max-w-4xl space-y-6">
        {/* Header */}
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" asChild>
            <Link href="/hr/dashboard">
              <ArrowLeft className="h-5 w-5" />
            </Link>
          </Button>
          <div>
            <h1 className="text-3xl font-bold text-foreground">Çalışan Davet Et</h1>
            <p className="text-muted-foreground">
              Çalışanlarınızı sisteme ekleyin ve davet maillerini gönderin
            </p>
          </div>
        </div>

        {/* Tabs for Manual vs CSV */}
        <Tabs defaultValue="manual" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="manual" className="flex items-center gap-2">
              <UserPlus className="h-4 w-4" />
              Manuel Ekle
            </TabsTrigger>
            <TabsTrigger value="csv" className="flex items-center gap-2">
              <Upload className="h-4 w-4" />
              CSV ile Toplu Ekle
            </TabsTrigger>
          </TabsList>

          {/* Manual Invite Tab */}
          <TabsContent value="manual">
            <Card className="border-border">
              <CardHeader>
                <CardTitle>Tek Çalışan Ekle</CardTitle>
                <CardDescription>
                  Çalışanın email ve adını girin. Otomatik davet maili gönderilecektir.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleManualInvite} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">Ad Soyad</Label>
                    <div className="relative">
                      <User className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="name"
                        type="text"
                        className="pl-9"
                        placeholder="Ahmet Yılmaz"
                        required
                        value={manualName}
                        onChange={(e) => setManualName(e.target.value)}
                        disabled={isLoading}
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="email"
                        type="email"
                        className="pl-9"
                        placeholder="ahmet@sirket.com"
                        required
                        value={manualEmail}
                        onChange={(e) => setManualEmail(e.target.value)}
                        disabled={isLoading}
                      />
                    </div>
                  </div>

                  <Button 
                    type="submit" 
                    className="w-full" 
                    disabled={isLoading}
                  >
                    {isLoading ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Gönderiliyor...
                      </>
                    ) : (
                      <>
                        <UserPlus className="mr-2 h-4 w-4" />
                        Davet Gönder
                      </>
                    )}
                  </Button>
                </form>
              </CardContent>
            </Card>
          </TabsContent>

          {/* CSV Upload Tab */}
          <TabsContent value="csv">
            <Card className="border-border">
              <CardHeader>
                <CardTitle>Toplu Çalışan Ekleme</CardTitle>
                <CardDescription>
                  CSV dosyası yükleyin. Format: <code>email,full_name</code>
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* CSV Format Example */}
                <div className="rounded-lg bg-accent/30 p-4 space-y-2">
                  <h4 className="font-semibold text-sm">CSV Dosya Formatı:</h4>
                  <pre className="text-xs bg-background p-3 rounded border border-border overflow-x-auto">
{`email,full_name
ahmet@sirket.com,Ahmet Yılmaz
ayse@sirket.com,Ayşe Demir
mehmet@sirket.com,Mehmet Kara`}
                  </pre>
                  <p className="text-xs text-muted-foreground">
                    İlk satır başlık olmalı. Sonraki satırlar çalışan bilgileri.
                  </p>
                </div>

                {/* File Upload */}
                <div className="space-y-2">
                  <Label htmlFor="csv-file">CSV Dosyası Seç</Label>
                  <Input
                    id="csv-file"
                    type="file"
                    accept=".csv"
                    onChange={handleCsvUpload}
                    disabled={isProcessing}
                  />
                </div>

                {/* Preview CSV Employees */}
                {csvEmployees.length > 0 && (
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <h4 className="font-semibold">
                        Yüklenecek Çalışanlar ({csvEmployees.length})
                      </h4>
                      <Button 
                        onClick={handleBulkInvite}
                        disabled={isProcessing || csvEmployees.every(e => e.status !== 'pending')}
                      >
                        {isProcessing ? (
                          <>
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            İşleniyor...
                          </>
                        ) : (
                          <>
                            <Upload className="mr-2 h-4 w-4" />
                            Tümünü Davet Et
                          </>
                        )}
                      </Button>
                    </div>

                    <div className="max-h-96 overflow-y-auto space-y-2 border border-border rounded-lg p-3">
                      {csvEmployees.map((employee, index) => (
                        <div 
                          key={index} 
                          className="flex items-center justify-between p-3 rounded-lg bg-background border border-border"
                        >
                          <div className="flex items-center gap-3">
                            {employee.status === 'pending' && (
                              <div className="h-8 w-8 rounded-full bg-blue-100 flex items-center justify-center">
                                <User className="h-4 w-4 text-blue-600" />
                              </div>
                            )}
                            {employee.status === 'success' && (
                              <div className="h-8 w-8 rounded-full bg-green-100 flex items-center justify-center">
                                <CheckCircle className="h-4 w-4 text-green-600" />
                              </div>
                            )}
                            {employee.status === 'error' && (
                              <div className="h-8 w-8 rounded-full bg-red-100 flex items-center justify-center">
                                <AlertCircle className="h-4 w-4 text-red-600" />
                              </div>
                            )}
                            <div>
                              <div className="font-medium">{employee.full_name}</div>
                              <div className="text-sm text-muted-foreground">{employee.email}</div>
                            </div>
                          </div>
                          {employee.message && (
                            <span className={`text-xs ${
                              employee.status === 'success' ? 'text-green-600' : 'text-red-600'
                            }`}>
                              {employee.message}
                            </span>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Info Card */}
        <Card className="border-blue-200 bg-blue-50">
          <CardHeader>
            <CardTitle className="text-sm flex items-center gap-2">
              <Mail className="h-4 w-4 text-blue-600" />
              Davet Maili Nasıl Çalışır?
            </CardTitle>
          </CardHeader>
          <CardContent className="text-sm text-muted-foreground space-y-2">
            <p>✅ Çalışana otomatik davet maili gönderilir</p>
            <p>✅ Mail içinde şifre oluşturma linki bulunur</p>
            <p>✅ Çalışan şifresini oluşturup sisteme giriş yapabilir</p>
            <p>✅ İlk girişte wellbeing anketi doldurması istenir</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

