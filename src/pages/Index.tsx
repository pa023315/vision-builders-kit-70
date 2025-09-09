import Header from "@/components/Header";
import HeroSection from "@/components/HeroSection";
import TimelineSection from "@/components/TimelineSection";
import StatsSection from "@/components/StatsSection";
import NewsSection from "@/components/NewsSection";

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main>
        <HeroSection />
        <TimelineSection />
        <StatsSection />
        <NewsSection />
      </main>
    </div>
  );
};

export default Index;
