# 🌟 Wellscore - Corporate Wellbeing Platform

> **Çalışan wellbeing'ini ölçün, analiz edin ve iyileştirin.**

Wellscore, kurumsal şirketlerin çalışan wellbeing'ini 8 boyutta değerlendiren, AI destekli öneriler sunan ve HR ekiplerine aksiyon planları sağlayan modern bir SaaS platformudur.

---

## 🚀 Hızlı Başlangıç

### 1. Prerequisites

- Node.js 18+ ve npm/pnpm
- Supabase hesabı ([supabase.com](https://supabase.com))

### 2. Installation

```bash
# Repository'yi klonla
git clone <repo-url>
cd wellscore

# Dependencies yükle
npm install --legacy-peer-deps

# Environment variables setup
cp env.example .env.local
# .env.local dosyasını Supabase bilgilerinle doldur
```

### 3. Supabase Setup

1. [Supabase Dashboard](https://supabase.com/dashboard)'a git
2. Yeni proje oluştur (veya mevcut projeyi kullan)
3. **SQL Editor**'ü aç
4. `scripts/AUTH_SYSTEM_SETUP.sql` dosyasını çalıştır
5. Settings > API'den Project URL ve Anon Key'i kopyala
6. `.env.local` dosyasına yapıştır

### 4. Run Development Server

```bash
npm run dev
```

🎉 Tarayıcıda aç: [http://localhost:3000](http://localhost:3000)

---

## 📦 Tech Stack

| Category | Technology |
|----------|-----------|
| **Framework** | Next.js 15 (App Router) |
| **Language** | TypeScript |
| **Database** | Supabase (PostgreSQL) |
| **Auth** | Supabase Auth |
| **UI Components** | Radix UI + Shadcn UI |
| **Styling** | Tailwind CSS |
| **Icons** | Lucide React |
| **Notifications** | Sonner |

---

## 🏗️ Architecture

```
wellscore/
├── app/                          # Next.js App Router
│   ├── page.tsx                  # Landing page
│   ├── auth/                     # Authentication pages
│   │   ├── login/                # Universal login
│   │   ├── hr-signup/            # HR company registration
│   │   └── reset-password/       # Employee password setup
│   ├── hr/                       # HR Admin routes
│   │   ├── dashboard/            # KPI & Analytics
│   │   ├── invite/               # Employee invitation
│   │   └── employees/            # Employee management
│   ├── employee/                 # Employee routes
│   │   ├── dashboard/            # Personal wellbeing dashboard
│   │   └── survey/               # Wellbeing survey
│   └── api/                      # API routes
│       └── invite-employee/      # Employee invitation API
├── components/                   # Reusable components
│   └── ui/                       # Shadcn UI components
├── lib/                          # Utilities
│   └── supabase/                 # Supabase clients
└── scripts/                      # Database scripts
    └── AUTH_SYSTEM_SETUP.sql     # Complete DB setup
```

---

## 🎯 Core Features

### For HR Admins 👔

- ✅ **Company Registration** - Şirket kaydı ve setup
- ✅ **KPI Dashboard** - Real-time analytics, participation rates, average scores
- ✅ **Employee Management** - Çalışan listesi, durum takibi
- ✅ **Bulk Invitation** - CSV ile toplu çalışan ekleme
- ✅ **Dimension Analytics** - 8 boyutta detaylı analiz
- ✅ **Risk Detection** - Düşük skorlu çalışanları tespit

### For Employees 👨‍💼

- ✅ **Personal Dashboard** - Kişisel WellScore ve boyut skorları
- ✅ **8-Dimension Survey** - Fiziksel, zihinsel, duygusal, sosyal, kariyer, finansal, çevresel, amaç
- ✅ **Visual Analytics** - Renkli kartlar ve progress barlar
- ✅ **Personalized Insights** - En güçlü ve gelişim alanları

### Authentication System 🔐

- ✅ **Company-based Auth** - Her şirket izole
- ✅ **Invitation-only** - Çalışanlar kendileri kayıt olamaz
- ✅ **Email Invitations** - HR, çalışanları email ile davet eder
- ✅ **Password Setup** - Çalışanlar davet linkinden şifre oluşturur
- ✅ **Role-based Redirects** - HR ve Employee ayrı dashboard'lara yönlendirilir

---

## 🎨 UI/UX Highlights

- 🎨 **Modern Gradients** - Professional gradient backgrounds
- 🎯 **Color-coded Dimensions** - Her wellbeing boyutu için özel renk
- 📊 **Visual Progress** - Progress bars ve score cards
- 🔔 **Toast Notifications** - Sonner ile güzel bildirimler
- 📱 **Responsive Design** - Mobile-first approach
- ⚡ **Loading States** - Smooth loading experiences
- 🎭 **Icon System** - Lucide icons everywhere

---

## 📊 Database Schema

### Key Tables

| Table | Description |
|-------|-------------|
| `companies` | Şirket bilgileri |
| `profiles` | Kullanıcı profilleri (HR + Employee) |
| `wellbeing_dimensions` | 8 wellbeing boyutu |
| `survey_questions` | Anket soruları |
| `survey_responses` | Anket yanıtları |
| `survey_answers` | Bireysel soru cevapları |
| `dimension_scores` | Boyut bazlı skorlar |
| `recommendations` | AI önerileri |
| `hr_actions` | HR aksiyon planları |

### RLS Policies

- ✅ **Company Isolation** - Her şirket sadece kendi verilerini görür
- ✅ **Role-based Access** - HR ve Employee farklı yetkiler
- ✅ **Row Level Security** - Supabase RLS ile güvenli veri erişimi

---

## 🔧 Development

### Useful Commands

```bash
# Development server
npm run dev

# Build for production
npm run build

# Run production build
npm start

# Lint code
npm run lint

# Type check
npx tsc --noEmit
```

### Environment Variables

```env
NEXT_PUBLIC_SUPABASE_URL=https://xxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUz...
NEXT_PUBLIC_SITE_URL=http://localhost:3000
```

---

## 📖 User Guide

### HR Admin Workflow

1. **Kayıt Ol**: `/auth/hr-signup` - Şirket ve HR bilgilerini gir
2. **Dashboard**: `/hr/dashboard` - KPI'ları ve analizleri gör
3. **Çalışan Ekle**: `/hr/invite` - Manuel veya CSV ile çalışan ekle
4. **Davet Maili**: Çalışanlara otomatik şifre oluşturma linki gönderilir
5. **Takip Et**: `/hr/employees` - Çalışanların anket durumlarını takip et

### Employee Workflow

1. **Davet Maili**: HR'dan gelen davet mailini aç
2. **Şifre Oluştur**: `/auth/reset-password` - Kendi şifreni belirle
3. **Login**: `/auth/login` - Sisteme giriş yap
4. **Dashboard**: `/employee/dashboard` - WellScore'unu gör
5. **Anket**: `/employee/survey` - İlk wellbeing anketini doldur

---

## 🐛 Troubleshooting

### Problem: "infinite recursion in RLS policies"

**Çözüm**: Eski RLS policies'leri temizle, `AUTH_SYSTEM_SETUP.sql` scriptini tekrar çalıştır.

### Problem: "Unable to acquire lock"

**Çözüm**: 
```bash
# Önceki Next.js proceslerini kapat
pkill -f "next dev"
# Lock dosyasını sil
rm -rf .next/dev/lock
# Serveri tekrar başlat
npm run dev
```

### Problem: Admin API çalışmıyor

**Çözüm**: Supabase Admin API için Service Role key gerekli. Bu development için production'da Edge Functions kullan.

---

## 🚀 Deployment

### Vercel (Recommended)

1. GitHub'a push et
2. [Vercel](https://vercel.com)'e import et
3. Environment variables ekle
4. Deploy!

### Environment Variables for Production

```env
NEXT_PUBLIC_SUPABASE_URL=<your-production-url>
NEXT_PUBLIC_SUPABASE_ANON_KEY=<your-production-key>
NEXT_PUBLIC_SITE_URL=https://your-domain.com
```

---

## 📝 License

MIT License - Tüm hakları saklıdır.

---

## 🤝 Support

Sorularınız için:
- 📧 Email: support@wellscore.com
- 📚 Docs: [SISTEM_HAZIR.md](./SISTEM_HAZIR.md)
- 🛠️ Setup: [KURULUM.md](./KURULUM.md)

---

**Made with ❤️ by Wellscore Team**
