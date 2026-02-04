-- Drop the overly permissive policy
DROP POLICY IF EXISTS "Service role can manage pending orders" ON public.pending_orders;

-- Add proper delete policy for users (to clean up their own pending orders)
CREATE POLICY "Users can delete own pending orders"
ON public.pending_orders
FOR DELETE
USING (user_id = auth.uid());