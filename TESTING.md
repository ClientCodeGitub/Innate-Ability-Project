# Testing Checklist

## Pre-Testing Setup

1. ✅ All environment variables are configured
2. ✅ Supabase table is created
3. ✅ Lemon Squeezy store, variant, and webhook are set up
4. ✅ Development server is running

## Test Flow 1: Complete Blueprint → Results Blurred

1. **Start Blueprint**
   - Go to http://localhost:3000
   - Click "Start Blueprint" button
   - Should navigate to `/blueprint`

2. **Complete Questions**
   - Answer all 16 questions
   - Progress bar should update
   - Can navigate back/forward
   - Required questions prevent moving forward if unanswered

3. **Submit Answers**
   - Click "Finish" on last question
   - Should redirect to `/email?rid=...`
   - Submit email → Redirect to `/results?rid=...`

4. **View Results (Locked)**
   - Should redirect to `/results?rid=...`
   - Results should be **blurred** (CSS blur applied)
   - Paywall overlay should be visible
   - Content should not be readable

## Test Flow 2: Click Unlock → Lemon Squeezy Checkout

1. **Initiate Checkout**
   - On results page, click "Pay to Unlock"
   - Should call `/api/lemon/checkout` with `rid`
   - Should redirect to Lemon Squeezy checkout page

2. **Complete Payment**
   - Complete checkout in Lemon Squeezy
   - Return to your site via success redirect

3. **Return to Results Page**
   - Should redirect back to `/results?rid=...`
   - Webhook unlocks results

## Test Flow 3: Simulate Webhook → Results Unlocked

### Option A: Use Lemon Squeezy Webhook Simulator

1. Go to Lemon Squeezy dashboard > Webhooks
2. Send event: `order_created` or `order_paid`
3. Set webhook URL to: `http://localhost:3000/api/lemon/webhook` (use ngrok for local testing)
4. Ensure payload contains `meta.custom_data.rid`

### Option B: Manual Database Update (for testing only)

⚠️ **Only for development testing!** In production, always use webhooks.

```sql
UPDATE results 
SET is_paid = true, 
    unlocked_at = NOW()
WHERE id = 'your-result-id';
```

### Option C: Use ngrok for Local Webhook Testing

1. Install ngrok: `brew install ngrok` (Mac) or download from ngrok.com
2. Start ngrok: `ngrok http 3000`
3. Copy the ngrok URL (e.g., `https://abc123.ngrok.io`)
4. Update Lemon Squeezy webhook URL to: `https://abc123.ngrok.io/api/lemon/webhook`
5. Complete a real payment in Lemon Squeezy
6. Lemon Squeezy will send webhook to your local server

## Test Flow 4: Verify Unlock

1. **Check Results Page**
   - Go to `/results?rid=your-result-id`
   - Results should be **unblurred** (no CSS blur)
   - Paywall overlay should be **hidden**
   - All content should be readable

2. **Verify Database**
   - Check Supabase dashboard
   - `results` table should show:
     - `is_paid = true`
     - `unlocked_at` timestamp set

## Edge Cases to Test

- ✅ Invalid `rid` parameter → Should redirect to home
- ✅ Missing result → Should show error
- ✅ Webhook without `rid` → Should log error but return 200
- ✅ Duplicate webhook events → Should be idempotent (no error)
- ✅ Payment cancelled → Should return to results page
- ✅ Network errors → Should show appropriate error messages

## Expected Behavior

### Security Checks
- ✅ Results never unlock from redirect alone
- ✅ Results only unlock from verified webhook
- ✅ Webhook signature is verified via Lemon Squeezy
- ✅ Invalid signatures are rejected (401)

### User Experience
- ✅ Smooth question flow with progress tracking
- ✅ Processing page provides feedback
- ✅ Results page shows blurred content when locked
- ✅ Paywall overlay is clear and compelling
- ✅ Results become readable after webhook unlock
- ✅ Results become readable after unlock

## Debugging Tips

1. **Check API Routes**
   - Look at server logs for errors
   - Verify environment variables are loaded
   - Check Supabase connection

2. **Check Webhook**
   - Use Lemon Squeezy webhook logs to see sent events
   - Check server logs for received webhooks
   - Verify signature verification is working

3. **Check Database**
   - Verify row exists in `results` table
   - Check `is_paid` status
   - Verify `computed_result` JSON is valid

4. **Check Frontend**
   - Open browser console for errors
   - Check network tab for API calls
   - Verify `rid` is passed correctly

## Common Issues

**Issue**: Webhook not received
- **Solution**: Use ngrok for local testing, verify webhook URL in Lemon Squeezy dashboard

**Issue**: Webhook not unlocking
- **Solution**: Ensure Lemon Squeezy webhook is sending `order_created`/`order_paid` and `meta.custom_data.rid` is present

**Issue**: Results not unlocking
- **Solution**: Check webhook logs, verify `meta.custom_data.rid` is present, check database update

**Issue**: Checkout not working
- **Solution**: Verify Lemon Squeezy credentials, check store/variant IDs, ensure webhook secret is correct
