import { Helmet } from "react-helmet-async";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { ExternalLink } from "lucide-react";

const About = () => {
  return (
    <>
      <Helmet>
        <title>關於我們 - GameCF</title>
        <meta property="og:title" content="關於我們 - GameCF" />
        <meta property="og:description" content="了解 GameCF 數位遊戲群眾募資資訊站的創立初衷與團隊介紹" />
        <meta property="og:image" content="https://mkllbwsxvkcacyztgsgv.supabase.co/storage/v1/object/public/lovable-uploads/0b5d0079-3daa-413d-a1d9-80c077436eb5.png" />
      </Helmet>
      <Header />
      <main className="min-h-screen bg-background">
        <div className="container mx-auto px-4 py-8">
          <div className="max-w-4xl mx-auto">
            {/* 關於我們 section */}
            <section className="mb-12">
              <h1 className="text-4xl font-bold text-foreground mb-8 text-center">
                關於我們
              </h1>
              <div className="bg-card border border-border rounded-lg p-8 shadow-sm">
                <div className="prose prose-lg max-w-none text-foreground">
                  <p className="text-lg leading-relaxed">
                    嗨 我是網站負責人 鄭祤呈 ian
                  </p>
                  <p className="text-lg leading-relaxed">
                    這個網站建立初衷是希望把我的經驗以及市場的資料彙整起來
                  </p>
                  <p className="text-lg leading-relaxed">
                    以建立完整資料庫為目標
                  </p>
                  <p className="text-lg leading-relaxed">
                    提供給未來想要發起群眾募資的遊戲團隊做參考
                  </p>
                  <p className="text-lg leading-relaxed">
                    相關資料皆由我個人搜集與撰寫
                  </p>
                  <p className="text-lg leading-relaxed">
                    預計每季進行維護與更新
                  </p>
                  <p className="text-lg leading-relaxed">
                    若有任何建議或想法都歡迎討論交流
                  </p>
                  <p className="text-lg leading-relaxed font-semibold">
                    希望網站能幫助到你，謝謝。
                  </p>
                </div>
              </div>
            </section>

            {/* 關於我 section */}
            <section>
              <h2 className="text-3xl font-bold text-foreground mb-8 text-center">
                關於我
              </h2>
              <div className="bg-card border border-border rounded-lg p-8 shadow-sm">
                <div className="text-center mb-6">
                  <h3 className="text-2xl font-semibold text-foreground mb-2">
                    鄭祤呈 - 專案顧問
                  </h3>
                </div>
                
                <div className="prose prose-lg max-w-none text-foreground mb-8">
                  <p className="text-lg leading-relaxed">
                    具有 8 年泛娛樂群眾募資經驗，經手集資案件近百件，參與4個百萬遊戲專案、《夕生》等數十個數位遊戲募資專案。其他泛娛樂專案包含遊戲雜誌《 舊遊戲時代 》、《 阿貓阿狗 木桶鎮觀光導覽手冊 》、《 天堂Talker 典藏版》等。
                  </p>
                </div>

                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <a
                    href="https://www.facebook.com/pa023315/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-center gap-2 bg-primary text-primary-foreground px-6 py-3 rounded-lg hover:bg-primary/90 transition-colors"
                  >
                    <span>個人 Facebook</span>
                    <ExternalLink className="h-4 w-4" />
                  </a>
                  
                  <a
                    href="https://pa023315.com/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-center gap-2 bg-secondary text-secondary-foreground px-6 py-3 rounded-lg hover:bg-secondary/80 transition-colors"
                  >
                    <span>個人網頁</span>
                    <ExternalLink className="h-4 w-4" />
                  </a>
                </div>
              </div>
            </section>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
};

export default About;