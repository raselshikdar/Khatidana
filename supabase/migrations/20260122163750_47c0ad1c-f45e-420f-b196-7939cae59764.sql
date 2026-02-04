-- Drop the old restrictive policy and create a new one allowing any logged-in user to submit reviews
DROP POLICY IF EXISTS "Purchasers can create reviews" ON public.reviews;

-- Allow any logged-in user to create reviews
CREATE POLICY "Logged in users can create reviews" 
ON public.reviews 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);