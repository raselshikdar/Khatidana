-- Add promo code tracking columns to orders table
ALTER TABLE public.orders 
ADD COLUMN IF NOT EXISTS promo_code_used TEXT DEFAULT NULL,
ADD COLUMN IF NOT EXISTS discount_amount NUMERIC DEFAULT 0;

-- Add promo code tracking to pending_orders for online payments
ALTER TABLE public.pending_orders 
ADD COLUMN IF NOT EXISTS promo_code_used TEXT DEFAULT NULL,
ADD COLUMN IF NOT EXISTS discount_amount NUMERIC DEFAULT 0;

-- Add comments for clarity
COMMENT ON COLUMN public.orders.promo_code_used IS 'Promo code applied to this order';
COMMENT ON COLUMN public.orders.discount_amount IS 'Discount amount in BDT applied from promo code';
COMMENT ON COLUMN public.pending_orders.promo_code_used IS 'Promo code applied to pending order';
COMMENT ON COLUMN public.pending_orders.discount_amount IS 'Discount amount in BDT for pending order';