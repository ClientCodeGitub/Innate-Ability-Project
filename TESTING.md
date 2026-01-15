# Testing Checklist

## Pre-Testing Setup

1. ✅ All environment variables are configured
2. ✅ Supabase table is created
3. ✅ Paddle product is set up
4. ✅ Development server is running

## Test Flow 1: Complete Blueprint → Results Blurred

1. **Start Blueprint**
   - Go to http://localhost:3000
   - Click "Start Blueprint" button
   - Should navigate to `/blueprint`

2. **Complete Questions**
   - Answer all 15 questions
   - Progress bar should update
   - Can navigate back/forward
   - Required questions prevent moving forward if unanswered

3. **Submit Answers**
   - Click "Finish" on last question
   - Should redirect to `/processing?rid=...`
   - Processing page shows staged messages for ~5 seconds

4. **View Results (Locked)**
   - Should redirect to `/results?rid=...`
   - Results should be **blurred** (CSS blur applied)
   - Paywall overlay should be visible
   - Content should not be readable

## Test Flow 2: Click Unlock → Paddle Checkout

1. **Initiate Checkout**
   - On results page, click "Unlock My Results"
   - Should call `/api/paddle/checkout` with `rid`
   - Should redirect to Paddle checkout page

2. **Complete Payment (Sandbox)**
   - Use Paddle sandbox test card: `4242 4242 4242 4242`
   - Expiry: Any future date
   - CVV: Any 3 digits
   - Complete checkout

3. **Return to Success Page**
   - Should redirect to `/unlock/success?rid=...`
   - Shows "Payment received, unlocking..."
   - Polls backend for unlock status

## Test Flow 3: Simulate Webhook → Results Unlocked

### Option A: Use Paddle Sandbox Webhook Simulator

1. Go to Paddle Dashboard > Developer Tools > Webhook Simulator
2. Select event: `payment_succeeded`
3. Set webhook URL to: `http://localhost:3000/api/paddle/webhook` (use ngrok for local testing)
4. Include in payload:
   ```json
   {
     "passthrough": "{\"rid\":\"your-result-id\"}",
     "subscription_id": "test-transaction-123",
     "user_id": "test-customer-123"
   }
   ```
5. Send webhook

### Option B: Manual Database Update (for testing only)

⚠️ **Only for development testing!** In production, always use webhooks.

```sql
UPDATE results 
SET unlocked = true, 
    unlocked_at = NOW(),
    paddle_transaction_id = 'test-123',
    paddle_customer_id = 'test-customer-123'
WHERE id = 'your-result-id';
```

### Option C: Use ngrok for Local Webhook Testing

1. Install ngrok: `brew install ngrok` (Mac) or download from ngrok.com
2. Start ngrok: `ngrok http 3000`
3. Copy the ngrok URL (e.g., `https://abc123.ngrok.io`)
4. Update Paddle webhook URL to: `https://abc123.ngrok.io/api/paddle/webhook`
5. Complete a real payment in Paddle sandbox
6. Paddle will send webhook to your local server

## Test Flow 4: Verify Unlock

1. **Check Results Page**
   - Go to `/results?rid=your-result-id`
   - Results should be **unblurred** (no CSS blur)
   - Paywall overlay should be **hidden**
   - All content should be readable

2. **Verify Database**
   - Check Supabase dashboard
   - `results` table should show:
     - `unlocked = true`
     - `unlocked_at` timestamp set
     - `paddle_transaction_id` populated
     - `paddle_customer_id` populated (if available)

## Edge Cases to Test

- ✅ Invalid `rid` parameter → Should redirect to home
- ✅ Missing result → Should show error
- ✅ Webhook without `rid` → Should log error but return 200
- ✅ Duplicate webhook events → Should be idempotent (no error)
- ✅ Payment cancelled → Should show cancel page
- ✅ Network errors → Should show appropriate error messages

## Expected Behavior

### Security Checks
- ✅ Results never unlock from redirect alone
- ✅ Results only unlock from verified webhook
- ✅ Webhook signature is verified
- ✅ Invalid signatures are rejected (401)

### User Experience
- ✅ Smooth question flow with progress tracking
- ✅ Processing page provides feedback
- ✅ Results page shows blurred content when locked
- ✅ Paywall overlay is clear and compelling
- ✅ Success page polls for unlock status
- ✅ Results become readable after unlock

## Debugging Tips

1. **Check API Routes**
   - Look at server logs for errors
   - Verify environment variables are loaded
   - Check Supabase connection

2. **Check Webhook**
   - Use Paddle webhook logs to see sent events
   - Check server logs for received webhooks
   - Verify signature verification is working

3. **Check Database**
   - Verify row exists in `results` table
   - Check `unlocked` status
   - Verify `computed_result` JSON is valid

4. **Check Frontend**
   - Open browser console for errors
   - Check network tab for API calls
   - Verify `rid` is passed correctly

## Common Issues

**Issue**: Webhook not received
- **Solution**: Use ngrok for local testing, verify webhook URL in Paddle dashboard

**Issue**: Signature verification fails
- **Solution**: Ensure `PADDLE_PUBLIC_KEY` is correct, check webhook payload format

**Issue**: Results not unlocking
- **Solution**: Check webhook logs, verify `rid` is in passthrough, check database update

**Issue**: Checkout not working
- **Solution**: Verify Paddle credentials, check product ID, ensure API key has correct permissions
