import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface SSLCommerzRequest {
  pendingOrderId: string;
  amount: number;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  shippingAddress: {
    district: string;
    thana: string;
    area: string;
  };
  productDetails: string;
}

Deno.serve(async (req) => {
  // Handle CORS preflight
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Authenticate user
    const authHeader = req.headers.get('Authorization');
    if (!authHeader?.startsWith('Bearer ')) {
      return new Response(
        JSON.stringify({ error: 'Unauthorized' }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const supabase = createClient(
      Deno.env.get('SUPABASE_URL')!,
      Deno.env.get('SUPABASE_ANON_KEY')!,
      { global: { headers: { Authorization: authHeader } } }
    );

    const token = authHeader.replace('Bearer ', '');
    const { data: claimsData, error: claimsError } = await supabase.auth.getClaims(token);
    
    if (claimsError || !claimsData?.claims) {
      return new Response(
        JSON.stringify({ error: 'Unauthorized' }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const body: SSLCommerzRequest = await req.json();
    const { pendingOrderId, amount, customerName, customerEmail, customerPhone, shippingAddress, productDetails } = body;

    console.log('Initiating SSLCommerz payment for pending order:', pendingOrderId);

    const storeId = Deno.env.get('SSLCOMMERZ_STORE_ID');
    const storePassword = Deno.env.get('SSLCOMMERZ_STORE_PASSWORD');

    if (!storeId || !storePassword) {
      console.error('SSLCommerz credentials not configured');
      return new Response(
        JSON.stringify({ error: 'Payment gateway not configured' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Get the origin from the request for callback URLs
    const origin = req.headers.get('origin') || 'https://bongshai.lovable.app';

    // SSLCommerz Sandbox API endpoint
    const sslcommerzUrl = 'https://sandbox.sslcommerz.com/gwprocess/v4/api.php';

    const formData = new URLSearchParams();
    formData.append('store_id', storeId);
    formData.append('store_passwd', storePassword);
    formData.append('total_amount', amount.toString());
    formData.append('currency', 'BDT');
    formData.append('tran_id', pendingOrderId); // Use pending order ID as transaction ID
    formData.append('success_url', `${origin}/payment/success?pending_id=${pendingOrderId}`);
    formData.append('fail_url', `${origin}/payment/fail?pending_id=${pendingOrderId}`);
    formData.append('cancel_url', `${origin}/payment/cancel?pending_id=${pendingOrderId}`);
    formData.append('ipn_url', `${Deno.env.get('SUPABASE_URL')}/functions/v1/sslcommerz-ipn`);
    
    // Customer info
    formData.append('cus_name', customerName || 'Customer');
    formData.append('cus_email', customerEmail || 'customer@example.com');
    formData.append('cus_phone', customerPhone);
    formData.append('cus_add1', shippingAddress.area);
    formData.append('cus_city', shippingAddress.thana);
    formData.append('cus_state', shippingAddress.district);
    formData.append('cus_postcode', '1000');
    formData.append('cus_country', 'Bangladesh');
    
    // Shipping info (same as customer)
    formData.append('shipping_method', 'Courier');
    formData.append('ship_name', customerName || 'Customer');
    formData.append('ship_add1', shippingAddress.area);
    formData.append('ship_city', shippingAddress.thana);
    formData.append('ship_state', shippingAddress.district);
    formData.append('ship_postcode', '1000');
    formData.append('ship_country', 'Bangladesh');
    
    // Product info
    formData.append('product_name', productDetails || 'Order Items');
    formData.append('product_category', 'E-commerce');
    formData.append('product_profile', 'physical-goods');

    console.log('Sending request to SSLCommerz...');

    const response = await fetch(sslcommerzUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: formData.toString(),
    });

    const result = await response.json();

    console.log('SSLCommerz response:', JSON.stringify(result));

    if (result.status === 'SUCCESS' && result.GatewayPageURL) {
      return new Response(
        JSON.stringify({ 
          success: true, 
          gatewayUrl: result.GatewayPageURL,
          sessionKey: result.sessionkey,
          pendingOrderId
        }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    } else {
      console.error('SSLCommerz error:', result.failedreason || 'Unknown error');
      return new Response(
        JSON.stringify({ 
          error: result.failedreason || 'Failed to initiate payment',
          details: result
        }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

  } catch (error: unknown) {
    console.error('Error in sslcommerz-init:', error);
    const message = error instanceof Error ? error.message : 'Internal server error';
    return new Response(
      JSON.stringify({ error: message }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
