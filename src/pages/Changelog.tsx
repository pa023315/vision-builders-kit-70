import { useState, useEffect } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Helmet } from "react-helmet-async";

interface ChangelogEntry {
  id: string;
  date: string;
  content: string;
}

const STORAGE_KEY = "changelog_entries";

const defaultEntries: ChangelogEntry[] = [
  { id: "1", date: "2026.01.03", content: "更新台灣數據" },
  { id: "2", date: "2025.09.18", content: "網站上線" },
];

const Changelog = () => {
  const [entries, setEntries] = useState<ChangelogEntry[]>([]);

  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      setEntries(JSON.parse(stored));
    } else {
      setEntries(defaultEntries);
    }
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
      </main>
      <Footer />
    </div>
  );
};

export default Changelog;
