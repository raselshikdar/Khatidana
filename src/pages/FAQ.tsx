import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { WhatsAppButton } from "@/components/layout/WhatsAppButton";
import { BackToTop } from "@/components/ui/BackToTop";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const faqs = [
  {
    category: "Orders & Shipping",
    questions: [
      {
        q: "How do I track my order?",
        a: "You can track your order by logging into your account and visiting the 'My Orders' section in your profile. You'll see real-time status updates and estimated delivery dates.",
      },
      {
        q: "What are the shipping charges?",
        a: "We offer free shipping on orders over ৳2,500. For orders below this amount, shipping charges are ৳60 inside Dhaka and ৳120 for outside Dhaka.",
      },
      {
        q: "How long does delivery take?",
        a: "Delivery typically takes 2-3 business days within Dhaka and 5-7 business days for other districts across Bangladesh.",
      },
    ],
  },
  {
    category: "Payment",
    questions: [
      {
        q: "What payment methods do you accept?",
        a: "We accept Cash on Delivery (COD), bKash, Nagad, and major credit/debit cards. All online payments are secured with industry-standard encryption.",
      },
      {
        q: "Is Cash on Delivery available?",
        a: "Yes! Cash on Delivery is available across Bangladesh. You can pay in cash when your order arrives.",
      },
      {
        q: "Are online payments secure?",
        a: "Absolutely. All online transactions are protected with SSL encryption and processed through trusted payment gateways.",
      },
    ],
  },
  {
    category: "Returns & Refunds",
    questions: [
      {
        q: "What is your return policy?",
        a: "We offer a 7-day return policy for most products. Items must be unused, in original packaging, and with all tags attached.",
      },
      {
        q: "How do I request a refund?",
        a: "To request a refund, go to your order history, select the order, and click 'Request Return'. Our team will process your request within 48 hours.",
      },
      {
        q: "How long do refunds take?",
        a: "Refunds are processed within 5-7 business days after we receive the returned item. The amount will be credited to your original payment method.",
      },
    ],
  },
  {
    category: "Account & Support",
    questions: [
      {
        q: "How do I create an account?",
        a: "Click the 'Sign In' button and select 'Create Account'. You can register using your email address or phone number.",
      },
      {
        q: "How can I contact customer support?",
        a: "You can reach us via WhatsApp, email at info@rasel.work.gd, or call us at +880 9696 051484. We're available Saturday-Thursday 9AM-9PM.",
      },
      {
        q: "Can I change or cancel my order?",
        a: "You can modify or cancel your order within 2 hours of placing it. After that, please contact customer support for assistance.",
      },
    ],
  },
];

const FAQ = () => {
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />
      
      <main className="flex-1 container py-8">
        <div className="max-w-3xl mx-auto">
          <h1 className="text-3xl md:text-4xl font-bold mb-2 text-foreground">
            Frequently Asked <span className="text-primary">Questions</span>
          </h1>
          <p className="text-muted-foreground mb-8">
            Find answers to common questions about shopping at Bongshai.
          </p>
          
          {faqs.map((section, idx) => (
            <div key={idx} className="mb-8">
              <h2 className="text-xl font-semibold mb-4 text-foreground flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-primary"></span>
                {section.category}
              </h2>
              <Accordion type="single" collapsible className="space-y-2">
                {section.questions.map((faq, faqIdx) => (
                  <AccordionItem
                    key={faqIdx}
                    value={`${idx}-${faqIdx}`}
                    className="bg-card border border-border rounded-lg px-4"
                  >
                    <AccordionTrigger className="text-left text-foreground hover:text-primary">
                      {faq.q}
                    </AccordionTrigger>
                    <AccordionContent className="text-muted-foreground">
                      {faq.a}
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            </div>
          ))}
          
          <div className="mt-10 p-6 bg-primary/10 rounded-xl text-center">
            <h3 className="text-lg font-semibold text-foreground mb-2">
              Still have questions?
            </h3>
            <p className="text-muted-foreground mb-4">
              Our customer support team is here to help!
            </p>
            <a
              href="/contact"
              className="inline-block px-6 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors"
            >
              Contact Us
            </a>
          </div>
        </div>
      </main>
      
      <Footer />
      <WhatsAppButton />
      <BackToTop />
    </div>
  );
};

export default FAQ;
