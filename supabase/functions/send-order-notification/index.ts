import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { Resend } from "https://esm.sh/resend@2.0.0";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.38.4";

const resend = new Resend(Deno.env.get("RESEND_API_KEY"));

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

interface OrderNotificationRequest {
  orderId: string;
  newStatus: string;
  userId: string;
  userName?: string;
  trackingNumber?: string;
  shippingAddress?: {
    district?: string;
    thana?: string;
    area?: string;
  };
}

const getStatusMessage = (status: string, trackingNumber?: string): { subject: string; heading: string; message: string; color: string } => {
  switch (status) {
    case "pending":
      return {
        subject: "Order Confirmed - Bongshai",
        heading: "🎉 Order Confirmed!",
        message: "Thank you for your order! We've received your order and will start processing it soon.",
        color: "#f59e0b"
      };
    case "processing":
      return {
        subject: "Your Order is Being Prepared - Bongshai",
        heading: "📦 Order Processing",
        message: "Great news! We're now preparing your order for shipment. You'll receive another update once it's on the way.",
        color: "#3b82f6"
      };
    case "shipped":
      return {
        subject: "Your Order is On the Way! - Bongshai",
        heading: "🚚 Order Shipped!",
        message: `Your order has been shipped and is on its way to you!${trackingNumber ? ` Your tracking number is: ${trackingNumber}` : ""}`,
        color: "#8b5cf6"
      };
    case "delivered":
      return {
        subject: "Order Delivered - Bongshai",
        heading: "✅ Order Delivered!",
        message: "Your order has been delivered! We hope you love your purchase. Thank you for shopping with Bongshai!",
        color: "#10b981"
      };
    case "cancelled":
      return {
        subject: "Order Cancelled - Bongshai",
        heading: "❌ Order Cancelled",
        message: "Your order has been cancelled. If you have any questions, please contact our support team.",
        color: "#ef4444"
      };
    default:
      return {
        subject: "Order Update - Bongshai",
        heading: "📋 Order Update",
        message: "Your order status has been updated.",
        color: "#6b7280"
      };
  }
};

const getEstimatedDelivery = (district?: string, status?: string): string => {
  if (status === "delivered" || status === "cancelled") {
    return "";
  }
  
  const isDhaka = district?.toLowerCase() === "dhaka";
  const today = new Date();
  
  let minDays = isDhaka ? 2 : 5;
  let maxDays = isDhaka ? 3 : 7;
  
  const minDate = new Date(today);
  minDate.setDate(today.getDate() + minDays);
  
  const maxDate = new Date(today);
  maxDate.setDate(today.getDate() + maxDays);
  
  const formatDate = (date: Date) => date.toLocaleDateString("en-BD", {
    weekday: "short",
    month: "short",
    day: "numeric"
  });
  
  return `${formatDate(minDate)} - ${formatDate(maxDate)}`;
};

const handler = async (req: Request): Promise<Response> => {
  console.log("send-order-notification function invoked");
  
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { orderId, newStatus, userId, userName, trackingNumber, shippingAddress }: OrderNotificationRequest = await req.json();
    
    console.log("Processing notification:", { orderId, newStatus, userId, userName });

    if (!userId) {
      console.error("No userId provided");
      return new Response(
        JSON.stringify({ error: "No userId provided" }),
        { status: 400, headers: { "Content-Type": "application/json", ...corsHeaders } }
      );
    }

    // Create Supabase admin client to fetch user email
    const supabaseAdmin = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "",
      { auth: { autoRefreshToken: false, persistSession: false } }
    );

    // Get user email from auth.users
    const { data: userData, error: userError } = await supabaseAdmin.auth.admin.getUserById(userId);
    
    if (userError || !userData?.user?.email) {
      console.error("Failed to get user email:", userError);
      return new Response(
        JSON.stringify({ error: "User email not found" }),
        { status: 404, headers: { "Content-Type": "application/json", ...corsHeaders } }
      );
    }

    const userEmail = userData.user.email;
    console.log("Sending email to:", userEmail);

    const statusInfo = getStatusMessage(newStatus, trackingNumber);
    const estimatedDelivery = getEstimatedDelivery(shippingAddress?.district, newStatus);

    const emailHtml = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
      </head>
      <body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
        <div style="background: linear-gradient(135deg, ${statusInfo.color} 0%, ${statusInfo.color}dd 100%); padding: 30px; border-radius: 12px 12px 0 0; text-align: center;">
          <h1 style="color: white; margin: 0; font-size: 28px;">${statusInfo.heading}</h1>
        </div>
        
        <div style="background: #f8fafc; padding: 30px; border: 1px solid #e2e8f0; border-top: none; border-radius: 0 0 12px 12px;">
          <p style="font-size: 16px; margin-bottom: 20px;">
            Hi ${userName || "Valued Customer"},
          </p>
          
          <p style="font-size: 16px; margin-bottom: 20px;">
            ${statusInfo.message}
          </p>
          
          <div style="background: white; padding: 20px; border-radius: 8px; border: 1px solid #e2e8f0; margin: 20px 0;">
            <p style="margin: 0 0 10px 0; font-weight: 600;">Order Details:</p>
            <p style="margin: 5px 0; color: #64748b;">Order ID: <span style="color: #333; font-family: monospace;">${orderId.slice(0, 8)}...</span></p>
            <p style="margin: 5px 0; color: #64748b;">Status: <span style="color: ${statusInfo.color}; font-weight: 600;">${newStatus.charAt(0).toUpperCase() + newStatus.slice(1)}</span></p>
            ${trackingNumber ? `<p style="margin: 5px 0; color: #64748b;">Tracking: <span style="color: #333; font-family: monospace;">${trackingNumber}</span></p>` : ""}
            ${estimatedDelivery ? `<p style="margin: 5px 0; color: #64748b;">Estimated Delivery: <span style="color: #333; font-weight: 600;">${estimatedDelivery}</span></p>` : ""}
          </div>
          
          ${shippingAddress?.district ? `
          <div style="background: white; padding: 20px; border-radius: 8px; border: 1px solid #e2e8f0; margin: 20px 0;">
            <p style="margin: 0 0 10px 0; font-weight: 600;">Delivery Address:</p>
            <p style="margin: 5px 0; color: #64748b;">${shippingAddress.area || ""}</p>
            <p style="margin: 5px 0; color: #64748b;">${shippingAddress.thana || ""}, ${shippingAddress.district}</p>
          </div>
          ` : ""}
          
          <div style="text-align: center; margin-top: 30px;">
            <a href="https://bongshai.lovable.app/profile" style="display: inline-block; background: ${statusInfo.color}; color: white; padding: 12px 30px; border-radius: 6px; text-decoration: none; font-weight: 600;">View Order</a>
          </div>
          
          <p style="font-size: 14px; color: #64748b; margin-top: 30px; text-align: center;">
            Need help? Contact us on WhatsApp: +8801518755031
          </p>
        </div>
        
        <div style="text-align: center; padding: 20px; color: #94a3b8; font-size: 12px;">
          <p style="margin: 0;">© ${new Date().getFullYear()} Bongshai. All rights reserved.</p>
        </div>
      </body>
      </html>
    `;

    const emailResponse = await resend.emails.send({
      from: "Bongshai <onboarding@resend.dev>",
      to: [userEmail],
      subject: statusInfo.subject,
      html: emailHtml,
    });

    console.log("Email sent successfully:", emailResponse);

    return new Response(JSON.stringify({ success: true, emailResponse }), {
      status: 200,
      headers: { "Content-Type": "application/json", ...corsHeaders },
    });
  } catch (error: any) {
    console.error("Error in send-order-notification function:", error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500, headers: { "Content-Type": "application/json", ...corsHeaders } }
    );
  }
};

serve(handler);
