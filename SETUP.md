# Setup Instructions

## Prerequisites

- Node.js 18+ installed
- A Supabase account and project
- A Lemon Squeezy account

## Step 1: Install Dependencies

```bash
npm install
```

## Step 2: Set Up Supabase

1. Create a new Supabase project at https://supabase.com
2. Go to SQL Editor in your Supabase dashboard
3. Run the SQL from `supabase-schema.sql` to create the `results` table
4. Go to Project Settings > API
5. Copy your:
   - Project URL
   - `anon` public key
   - `service_role` key (keep this secret!)

## Step 3: Set Up Lemon Squeezy

1. Sign up at https://www.lemonsqueezy.com/
2. Create a product and variant
3. Copy your Store ID and Variant ID
4. Generate an API key
5. Set up webhook:
   - Add webhook URL: `https://your-domain.com/api/lemonsqueezy/webhook`
   - Subscribe to order events (e.g. `order_created` or `order_paid`)
   - Copy the Webhook Secret

## Step 4: Configure Environment Variables

1. Copy `env.example` to `.env.local`:
   ```bash
   cp env.example .env.local
   ```

2. Fill in all the values in `.env.local`:
   ```env
   NEXT_PUBLIC_BASE_URL=http://localhost:3000
   SUPABASE_URL=your_supabase_url
   SUPABASE_ANON_KEY=your_anon_key
   SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
   LEMONSQUEEZY_API_KEY=your_lemonsqueezy_api_key
   LEMONSQUEEZY_STORE_ID=your_lemonsqueezy_store_id
   LEMONSQUEEZY_VARIANT_ID=your_lemonsqueezy_variant_id
   LEMONSQUEEZY_WEBHOOK_SECRET=your_lemonsqueezy_webhook_secret
   ```

## Step 5: Run the Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Step 6: Test the Flow

See `TESTING.md` for detailed testing instructions.

## Production Deployment

1. Deploy to Vercel, Netlify, or your preferred hosting
2. Update `NEXT_PUBLIC_BASE_URL` to your production domain
3. Update Lemon Squeezy webhook URL to your production domain
4. Use production Lemon Squeezy credentials
5. Ensure environment variables are set in your hosting platform

## Important Security Notes

- Never commit `.env.local` to git (it's in `.gitignore`)
- Keep `SUPABASE_SERVICE_ROLE_KEY` and `LEMONSQUEEZY_API_KEY` secret
- Webhook signature verification is critical - always verify signatures
- Results are only unlocked via verified webhook, never from redirect alone
