import { Helmet } from "react-helmet-async";
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
      <Helmet>
        <title>GameCF 數位遊戲群眾募資資訊站</title>
        <meta property="og:title" content="GameCF 數位遊戲群眾募資資訊站" />
        <meta property="og:description" content="探索台灣與全球數位遊戲群眾募資趨勢" />
        <meta property="og:image" content="https://mkllbwsxvkcacyztgsgv.supabase.co/storage/v1/object/public/lovable-uploads/0b5d0079-3daa-413d-a1d9-80c077436eb5.png" />
      </Helmet>
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
