import { useState, useEffect } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Helmet } from "react-helmet-async";
import { supabase } from "@/integrations/supabase/client";
import { Loader2 } from "lucide-react";

interface ChangelogEntry {
  id: string;
  date: string;
  content: string;
}

const Changelog = () => {
  const [entries, setEntries] = useState<ChangelogEntry[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchEntries = async () => {
      const { data } = await supabase
        .from("changelog")
        .select("id, date, content")
        .order("created_at", { ascending: false });

      setEntries(data || []);
      setLoading(false);
    };

    fetchEntries();
  }, []);

  return (
    <div className="min-h-screen bg-background">
      <Helmet>
        <title>更新紀錄 | 桌遊群募研究社</title>
        <meta name="description" content="桌遊群募研究社網站更新紀錄" />
      </Helmet>
      <Header />
      <main className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold text-foreground mb-8">更新紀錄</h1>
        {loading ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="h-6 w-6 animate-spin" />
          </div>
        ) : (
          <div className="space-y-4">
            {entries.map((item) => (
              <div
                key={item.id}
                className="flex items-start gap-4 p-4 rounded-lg bg-card border border-border"
              >
                <span className="text-sm font-mono text-muted-foreground whitespace-nowrap">
                  {item.date}
                </span>
                <span className="text-foreground">{item.content}</span>
              </div>
            ))}
          </div>
        )}
      </main>
      <Footer />
    </div>
  );
};

export default Changelog;
