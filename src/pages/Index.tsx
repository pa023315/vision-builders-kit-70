import Header from "@/components/Header";
import Footer from "@/components/Footer";
import HeroSection from "@/components/HeroSection";
import TimelineSection from "@/components/TimelineSection";
import StatsSection from "@/components/StatsSection";
import HighestFundingSection from "@/components/HighestFundingSection";
import NewsSection from "@/components/NewsSection";

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main>
        <HeroSection />
        <TimelineSection />
        <StatsSection />
        <HighestFundingSection />
        <NewsSection />
      </main>
      <Footer />
    </div>
  );
};

export default Index;
