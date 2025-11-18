# 📧 Email Test & Debugging Guide

## Problem
Employee invitation emails are not being sent because the `SUPABASE_SERVICE_ROLE_KEY` is missing.

## Solution

### 1. Get Your Service Role Key

1. Go to: https://supabase.com/dashboard/project/oyevlrynbxgjaycqmrhu/settings/api
2. Scroll to **"Service Role"** section (NOT anon key!)
3. Click "Copy" to copy the **service_role secret** key
4. It should look like: `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im95ZXZscnluYnhnamF5Y3Ftcmh1Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2MzMxMjMzNSwiZXhwIjoyMDc4ODg4MzM1fQ...`

### 2. Add to .env.local

Open `/Applications/wellscore/.env.local` and replace:

```
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key_here
```

With your actual key:

```
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSI...
```

### 3. Restart Dev Server

```bash
cd /Applications/wellscore
# Stop current server (Ctrl+C)
npm run dev
```

### 4. Test Email Configuration

Visit: **http://localhost:3000/api/test-email**

This will show you:
- ✅ Which environment variables are set
- ✅ If service client can be created
- ✅ If email function works
- 📝 Detailed error messages if any

### 5. Test Employee Invitation

1. Go to: http://localhost:3000/hr/invite
2. Try inviting a test employee
3. Check terminal logs for:
   ```
   [Sending password reset email to]: test@example.com
   [Redirect URL]: http://localhost:3000/auth/reset-password
   [Password reset email sent successfully]
   ```

### 6. Check Supabase Logs

Go to: https://supabase.com/dashboard/project/oyevlrynbxgjaycqmrhu/logs/auth-logs

You should see:
- Email sent attempts
- Success/failure status
- Delivery details

### 7. Local Email Testing (Inbucket)

Supabase provides a local email inbox for testing:

1. Go to: https://supabase.com/dashboard/project/oyevlrynbxgjaycqmrhu/settings/auth
2. Scroll to "Email Templates"
3. You should see an "Inbucket" link for local email testing
4. **OR** check if Supabase has sent to a real email (check spam folder!)

## Debugging

### If emails still don't arrive:

1. **Check Auth Logs**: https://supabase.com/dashboard/project/oyevlrynbxgjaycqmrhu/logs/auth-logs
2. **Check Terminal**: Look for `[Password reset email sent successfully]`
3. **Check Spam Folder**: Real emails might go to spam
4. **Verify Email Template**: Make sure redirect URL matches your site

### Common Issues:

- ❌ **"Invalid JWT"**: Wrong service role key
- ❌ **"Email rate limit"**: Too many emails sent (wait or use different email)
- ❌ **"SMTP not configured"**: Supabase handles this automatically
- ❌ **"User already exists"**: Email already registered

## Event Registration Debug

Added detailed logging to debug why employee requests don't show in HR panel.

### Check Terminal When:

1. **Employee requests event** → Look for:
   ```
   [WellScore] User ID: ...
   [WellScore] Event ID: ...
   [WellScore] User Company ID: ...
   [WellScore] Event request successful, data: ...
   ```

2. **HR views actions page** → Look for:
   ```
   [HR Actions] Event registrations: [...]
   [HR Actions] Registration error: null
   [HR Actions] Company ID: ...
   [HR Actions] Requests by event: { event-id: 1, ... }
   ```

### If No Requests Show:

- Check if `company_id` matches between employee and HR
- Check if `status` is "requested"
- Check terminal logs for query errors

## Quick Test Commands

```bash
# 1. Test email config
curl http://localhost:3000/api/test-email

# 2. Check .env.local
cat /Applications/wellscore/.env.local

# 3. Restart server with logs
cd /Applications/wellscore
npm run dev | tee logs.txt
```

---

**ÖNEMLI**: Service role key çok güçlü bir key! Production'da ASLA client-side'a gönderme, sadece API routes'larda kullan!

