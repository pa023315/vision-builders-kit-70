import { Helmet } from "react-helmet-async";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { CrowdfundingTrackerSection } from "@/components/CrowdfundingTrackerSection";

const CrowdfundingTracker = () => {
  return (
    <div className="min-h-screen bg-background">
      <Helmet>
        <title>即時電子遊戲群眾募資追蹤 - GameCF</title>
        <meta
          property="og:title"
          content="即時電子遊戲群眾募資追蹤 - GameCF"
        />
        <meta
          property="og:description"
          content="追蹤 Kickstarter 與 CAMPFIRE 上正在進行的電子遊戲群眾募資專案"
        />
        <meta
          property="og:image"
          content="https://mkllbwsxvkcacyztgsgv.supabase.co/storage/v1/object/public/lovable-uploads/0b5d0079-3daa-413d-a1d9-80c077436eb5.png"
        />
      </Helmet>
      <Header />
      <main className="container py-8">
        <div className="mb-8">
          <h1 className="mb-4 text-4xl font-bold">
            即時電子遊戲
            <span className="text-primary">群眾募資追蹤</span>
          </h1>
          <p className="text-lg text-muted-foreground">
            每日追蹤 Kickstarter 與 CAMPFIRE 的電子遊戲募資專案，並透過審核機制排除桌遊、卡牌、活動與其他非電子遊戲內容。
          </p>
        </div>

        <CrowdfundingTrackerSection />
      </main>
      <Footer />
    </div>
  );
};

export default CrowdfundingTracker;
