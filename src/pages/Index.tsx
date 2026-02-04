import { Layout } from "@/components/layout/Layout";
import { HeroBanner } from "@/components/home/HeroBanner";
import { FeaturedCategories } from "@/components/home/FeaturedCategories";
import { FlashSaleSection } from "@/components/home/FlashSaleSection";
import { DailyDeals } from "@/components/home/DailyDeals";

const Index = () => {
  return (
    <Layout className="container py-4 md:py-6">
      <HeroBanner />
      <FeaturedCategories />
      <FlashSaleSection />
      <DailyDeals />
    </Layout>
  );
};

export default Index;
