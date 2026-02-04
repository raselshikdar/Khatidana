-- Create trigger function to auto-update payment_status when COD order is delivered
CREATE OR REPLACE FUNCTION public.auto_mark_cod_paid()
RETURNS TRIGGER AS $$
BEGIN
  -- If order status is being changed to 'delivered' and payment method is 'cod'
  IF NEW.status = 'delivered' AND NEW.payment_method = 'cod' AND OLD.status != 'delivered' THEN
    NEW.payment_status = 'paid';
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

-- Create trigger on orders table
DROP TRIGGER IF EXISTS auto_mark_cod_paid_trigger ON public.orders;
CREATE TRIGGER auto_mark_cod_paid_trigger
BEFORE UPDATE ON public.orders
FOR EACH ROW
EXECUTE FUNCTION public.auto_mark_cod_paid();