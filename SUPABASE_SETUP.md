# Supabase Setup

This site now expects Supabase to store:

- `appointments`
- `inquiries`

## 1. Create the tables

Run the SQL in [supabase/schema.sql](</C:/Users/priya/OneDrive/Dokumen/dilip website/supabase/schema.sql>) inside the Supabase SQL editor.

## 2. Add environment variables

Set these in Netlify or your local environment:

```text
SUPABASE_URL=
SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=
EMAIL_HOST=
EMAIL_PORT=
EMAIL_USER=
EMAIL_PASS=
EMAIL_RECEIVER=
```

Use [.env.example](</C:/Users/priya/OneDrive/Dokumen/dilip website/.env.example>) as the template.

## 3. What is connected

- Website consultation form posts to `/.netlify/functions/bookings`
- Contact form posts to `/.netlify/functions/inquiries`
- Both functions write to Supabase server-side
- Booking function also sends internal email and client confirmation email when SMTP env vars are present

## 4. Important note

Live Supabase writes cannot succeed until the real Supabase project URL and keys are added to the deployment environment.
