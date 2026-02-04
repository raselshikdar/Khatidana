import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

Deno.serve(async (req) => {
  // Handle CORS preflight
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Parse IPN data (can be POST form data or query params)
    let ipnData: Record<string, string> = {};
    
    if (req.method === 'POST') {
      const contentType = req.headers.get('content-type') || '';
      if (contentType.includes('application/x-www-form-urlencoded')) {
        const formData = await req.formData();
        formData.forEach((value, key) => {
          ipnData[key] = value.toString();
        });
      } else {
        ipnData = await req.json();
      }
    } else {
      const url = new URL(req.url);
      url.searchParams.forEach((value, key) => {
        ipnData[key] = value;
      });
    }

    console.log('SSLCommerz IPN received:', JSON.stringify(ipnData));

    const transactionId = ipnData.tran_id; // This is the pending_order_id
    const status = ipnData.status;
    const valId = ipnData.val_id;
    const bankTranId = ipnData.bank_tran_id;

    if (!transactionId) {
      console.error('No transaction ID in IPN');
      return new Response('No transaction ID', { status: 400, headers: corsHeaders });
    }

    // Initialize Supabase with service role for admin operations
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL')!,
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
    );

    // Check if this is a pending order (new flow) or existing order (old flow)
    const { data: pendingOrder, error: pendingError } = await supabase
      .from('pending_orders')
      .select('*')
      .eq('id', transactionId)
      .maybeSingle();

    // If pending order exists, process with new flow
    if (pendingOrder && status === 'VALID' && valId) {
      const storeId = Deno.env.get('SSLCOMMERZ_STORE_ID');
      const storePassword = Deno.env.get('SSLCOMMERZ_STORE_PASSWORD');

      // Validate transaction with SSLCommerz
      const validateUrl = `https://sandbox.sslcommerz.com/validator/api/validationserverAPI.php?val_id=${valId}&store_id=${storeId}&store_passwd=${storePassword}&format=json`;
      
      const validateResponse = await fetch(validateUrl);
      const validateResult = await validateResponse.json();

      console.log('SSLCommerz validation result:', JSON.stringify(validateResult));

      if (validateResult.status === 'VALID' || validateResult.status === 'VALIDATED') {
        // Create the actual order from pending order with promo code info
        const { data: newOrder, error: orderError } = await supabase
          .from('orders')
          .insert({
            user_id: pendingOrder.user_id,
            total_price: pendingOrder.total_price, // Already discounted
            status: 'processing',
            payment_method: 'card',
            shipping_address: pendingOrder.shipping_address,
            shipping_fee: pendingOrder.shipping_fee,
            notes: pendingOrder.notes,
            payment_status: 'paid',
            payment_transaction_id: bankTranId || valId,
            promo_code_used: pendingOrder.promo_code_used || null,
            discount_amount: pendingOrder.discount_amount || 0,
            admin_notes: `Online payment successful. Bank Tran ID: ${bankTranId || 'N/A'}, Val ID: ${valId}${pendingOrder.promo_code_used ? `. Promo: ${pendingOrder.promo_code_used} (-৳${pendingOrder.discount_amount})` : ''}`
          })
          .select()
          .single();

        if (orderError) {
          console.error('Failed to create order from pending:', orderError);
          return new Response('Failed to create order', { status: 500, headers: corsHeaders });
        }

        console.log('Order created from pending order:', newOrder.id);

        // Increment coupon usage if promo code was used
        if (pendingOrder.promo_code_used) {
          const { data: couponData } = await supabase
            .from('coupons')
            .select('used_count')
            .eq('code', pendingOrder.promo_code_used)
            .single();
          
          if (couponData) {
            await supabase
              .from('coupons')
              .update({ used_count: (couponData.used_count || 0) + 1 })
              .eq('code', pendingOrder.promo_code_used);
            
            console.log('Coupon usage incremented:', pendingOrder.promo_code_used);
          }
        }

        // Create order items from cart_items
        const cartItems = pendingOrder.cart_items as Array<{
          id: string;
          name: string;
          price: number;
          quantity: number;
        }>;

        const orderItems = cartItems.map(item => ({
          order_id: newOrder.id,
          product_id: item.id,
          product_name: item.name,
          quantity: item.quantity,
          price: item.price,
        }));

        const { error: itemsError } = await supabase
          .from('order_items')
          .insert(orderItems);

        if (itemsError) {
          console.error('Failed to create order items:', itemsError);
        }

        // Update product stock
        for (const item of cartItems) {
          const { data: productData } = await supabase
            .from('products')
            .select('stock')
            .eq('id', item.id)
            .maybeSingle();
          
          if (productData) {
            await supabase
              .from('products')
              .update({ stock: Math.max(0, productData.stock - item.quantity) })
              .eq('id', item.id);
          }
        }

        // Delete the pending order
        await supabase
          .from('pending_orders')
          .delete()
          .eq('id', transactionId);

        console.log('Pending order processed and deleted:', transactionId);
      }

      return new Response('IPN Processed', { status: 200, headers: corsHeaders });
    }

    // Fallback: Check if order exists (old flow for backward compatibility)
    const { data: order, error: orderError } = await supabase
      .from('orders')
      .select('id, status, total_price')
      .eq('id', transactionId)
      .maybeSingle();

    if (orderError || !order) {
      console.error('Order/Pending order not found:', transactionId, orderError);
      return new Response('Order not found', { status: 404, headers: corsHeaders });
    }

    // Verify the payment with SSLCommerz if VALID status (old flow)
    if (status === 'VALID' && valId) {
      const storeId = Deno.env.get('SSLCOMMERZ_STORE_ID');
      const storePassword = Deno.env.get('SSLCOMMERZ_STORE_PASSWORD');

      const validateUrl = `https://sandbox.sslcommerz.com/validator/api/validationserverAPI.php?val_id=${valId}&store_id=${storeId}&store_passwd=${storePassword}&format=json`;
      
      const validateResponse = await fetch(validateUrl);
      const validateResult = await validateResponse.json();

      console.log('SSLCommerz validation result:', JSON.stringify(validateResult));

      if (validateResult.status === 'VALID' || validateResult.status === 'VALIDATED') {
        const { error: updateError } = await supabase
          .from('orders')
          .update({ 
            status: 'processing',
            payment_status: 'paid',
            payment_transaction_id: bankTranId || valId,
            admin_notes: `Online payment successful. Bank Tran ID: ${bankTranId || 'N/A'}, Val ID: ${valId}`
          })
          .eq('id', transactionId);

        if (updateError) {
          console.error('Failed to update order:', updateError);
        } else {
          console.log('Order updated successfully:', transactionId);
        }
      }
    } else if (status === 'FAILED' || status === 'CANCELLED') {
      const { error: updateError } = await supabase
        .from('orders')
        .update({ 
          payment_status: status.toLowerCase(),
          admin_notes: `Payment ${status.toLowerCase()}. Reason: ${ipnData.error || 'N/A'}`
        })
        .eq('id', transactionId);

      if (updateError) {
        console.error('Failed to update order notes:', updateError);
      }
    }

    return new Response('IPN Received', { status: 200, headers: corsHeaders });

  } catch (error) {
    console.error('Error in sslcommerz-ipn:', error);
    return new Response('Internal server error', { status: 500, headers: corsHeaders });
  }
});