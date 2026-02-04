-- Create pending_orders table for holding cart data during online payment
CREATE TABLE public.pending_orders (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  total_price NUMERIC NOT NULL,
  payment_method TEXT NOT NULL DEFAULT 'card',
  shipping_address JSONB NOT NULL,
  shipping_fee NUMERIC DEFAULT 0,
  notes TEXT,
  cart_items JSONB NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  expires_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT (now() + interval '30 minutes')
);

-- Enable RLS
ALTER TABLE public.pending_orders ENABLE ROW LEVEL SECURITY;

-- Users can create their own pending orders
CREATE POLICY "Users can create own pending orders"
ON public.pending_orders
FOR INSERT
WITH CHECK (user_id = auth.uid());

-- Users can view their own pending orders
CREATE POLICY "Users can view own pending orders"
ON public.pending_orders
FOR SELECT
USING (user_id = auth.uid());

-- Service role can manage all (for edge functions)
CREATE POLICY "Service role can manage pending orders"
ON public.pending_orders
FOR ALL
USING (true)
WITH CHECK (true);

-- Add payment_status column to orders table
ALTER TABLE public.orders ADD COLUMN IF NOT EXISTS payment_status TEXT DEFAULT 'pending';
ALTER TABLE public.orders ADD COLUMN IF NOT EXISTS payment_transaction_id TEXT;