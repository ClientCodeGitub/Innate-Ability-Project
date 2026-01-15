# Innate Ability - Full-Stack Next.js Application

A complete full-stack application built with Next.js 14, TypeScript, Tailwind CSS, Supabase, and Paddle payments. Features a multi-step blueprint questionnaire that generates personalized results, with a secure paywall system that unlocks content only after verified payment.

## 🚀 Features

### Core Flow
1. **Home Page** - Landing page with "Start Blueprint" CTA
2. **Blueprint Questionnaire** - 15-question multi-step flow with progress tracking
3. **Processing Page** - Staged loading messages while generating results
4. **Results Page** - Personalized archetype results with paywall overlay
5. **Payment Integration** - Paddle checkout for $19 one-time unlock
6. **Secure Unlock** - Webhook-verified payment processing

### Security Features
- ✅ Server-side result generation (deterministic scoring)
- ✅ Webhook signature verification (Paddle Classic)
- ✅ Database-backed unlock status (never from redirect alone)
- ✅ Idempotent webhook processing
- ✅ Input validation with Zod

### Tech Stack
- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Database**: Supabase (PostgreSQL)
- **Payments**: Paddle Classic API
- **Validation**: Zod

## 📋 Quick Start

See [SETUP.md](./SETUP.md) for detailed setup instructions.

### 1. Install Dependencies
```bash
npm install
```

### 2. Set Up Environment Variables
Copy `env.example` to `.env.local` and fill in your credentials:
- Supabase URL and keys
- Paddle vendor ID, API key, product ID, and public key

### 3. Set Up Database
Run the SQL from `supabase-schema.sql` in your Supabase SQL Editor.

### 4. Run Development Server
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

## 📁 Project Structure

```
├── app/
│   ├── api/
│   │   ├── results/
│   │   │   ├── create/route.ts    # Create result from answers
│   │   │   └── get/route.ts       # Get result by ID
│   │   └── paddle/
│   │       ├── checkout/route.ts  # Create Paddle checkout
│   │       └── webhook/route.ts    # Handle Paddle webhooks
│   ├── blueprint/page.tsx          # Multi-step questionnaire
│   ├── processing/page.tsx         # Loading/processing page
│   ├── results/page.tsx            # Results display (locked/unlocked)
│   ├── unlock/
│   │   ├── success/page.tsx        # Payment success page
│   │   └── cancel/page.tsx         # Payment cancel page
│   └── page.tsx                    # Home page
├── components/
│   ├── ProgressBar.tsx             # Question progress indicator
│   ├── QuestionCard.tsx             # Question UI component
│   ├── PaywallOverlay.tsx           # Payment overlay
│   └── ... (landing page components)
├── lib/
│   ├── questions.ts                # Question definitions
│   ├── scoring.ts                  # Archetype scoring logic
│   └── supabase.ts                 # Supabase client
└── supabase-schema.sql             # Database schema
```

## 🧪 Testing

See [TESTING.md](./TESTING.md) for comprehensive testing instructions.

### Quick Test Flow
1. Complete blueprint → Results should be blurred
2. Click unlock → Redirects to Paddle checkout
3. Complete payment → Webhook unlocks results
4. Return to results → Content should be unblurred

## 🔒 Security Implementation

### Payment Unlock Flow
1. User completes blueprint → Results stored with `unlocked=false`
2. User clicks "Unlock" → Redirected to Paddle checkout
3. User completes payment → Paddle sends webhook
4. **Webhook handler verifies signature** → Updates database
5. User returns → Results page checks database → Shows unblurred content

**Critical**: Results are NEVER unlocked from the success redirect alone. Only verified webhooks can unlock content.

## 📊 Archetype System

The scoring system identifies 6 archetypes:
- **Builder** - Systems and structures
- **Strategist** - Planning and analysis
- **Executor** - Action and implementation
- **Creator** - Innovation and ideation
- **Optimizer** - Efficiency and improvement
- **Connector** - Relationships and collaboration

Results include:
- Primary and secondary archetype
- Strength signals
- Blind spots
- Best environments
- 7-day activation plan

## 🌐 Paddle Integration

This implementation uses **Paddle Classic API** for one-time payments:
- Checkout creation via `/api/paddle/checkout`
- Webhook handling via `/api/paddle/webhook`
- Signature verification using RSA-SHA1
- Passthrough data to link payments to results

## 📝 Environment Variables

Required variables (see `env.example`):
- `NEXT_PUBLIC_BASE_URL` - Your application URL
- `SUPABASE_URL` - Supabase project URL
- `SUPABASE_ANON_KEY` - Supabase anonymous key
- `SUPABASE_SERVICE_ROLE_KEY` - Supabase service role key
- `PADDLE_VENDOR_ID` - Paddle vendor ID
- `PADDLE_API_KEY` - Paddle API key
- `PADDLE_PRODUCT_ID` - Paddle product ID for $19 payment
- `PADDLE_PUBLIC_KEY` - Paddle public key for webhook verification

## 🚢 Production Deployment

1. Deploy to Vercel/Netlify/your platform
2. Set environment variables in hosting dashboard
3. Update `NEXT_PUBLIC_BASE_URL` to production domain
4. Update Paddle webhook URL to production domain
5. Use production Paddle keys (not sandbox)

## 📚 Documentation

- [SETUP.md](./SETUP.md) - Detailed setup instructions
- [TESTING.md](./TESTING.md) - Testing checklist and procedures
- [supabase-schema.sql](./supabase-schema.sql) - Database schema

## ⚠️ Important Notes

- Never commit `.env.local` to git
- Always verify webhook signatures in production
- Test webhook flow thoroughly before going live
- Use ngrok for local webhook testing
- Keep service role keys secure
# Innate-Ability-Project
