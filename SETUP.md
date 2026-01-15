# Setup Instructions

## Prerequisites

- Node.js 18+ installed
- A Supabase account and project
- A Paddle account (Classic API)

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

## Step 3: Set Up Paddle

1. Sign up for Paddle at https://paddle.com
2. Go to your Paddle vendor dashboard
3. Create a product:
   - Product name: "Innate Ability Unlock"
   - Price: $19.00 USD (one-time payment)
   - Note the Product ID
4. Get your API credentials:
   - Vendor ID (found in Account Settings)
   - API Key (generate in Developer Tools > Authentication)
   - Public Key (for webhook verification, found in Developer Tools > Notifications)
5. Set up webhook:
   - Go to Developer Tools > Notifications
   - Add webhook URL: `https://your-domain.com/api/paddle/webhook`
   - Select events: `payment_succeeded`, `subscription_payment_succeeded`
   - Save the webhook secret (if provided) or use Public Key for verification

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
   PADDLE_VENDOR_ID=your_vendor_id
   PADDLE_API_KEY=your_api_key
   PADDLE_PRODUCT_ID=your_product_id
   PADDLE_PUBLIC_KEY=your_public_key
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
3. Update Paddle webhook URL to your production domain
4. Use production Paddle keys (not sandbox)
5. Ensure environment variables are set in your hosting platform

## Important Security Notes

- Never commit `.env.local` to git (it's in `.gitignore`)
- Keep `SUPABASE_SERVICE_ROLE_KEY` and `PADDLE_API_KEY` secret
- Webhook signature verification is critical - always verify signatures
- Results are only unlocked via verified webhook, never from redirect alone
