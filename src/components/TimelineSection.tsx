import { Card, CardContent } from "@/components/ui/card";

const TimelineSection = () => {
  const timelineEvents = [
    {
      year: "2009年",
      title: "Kickstarter成立，開創現代群眾募資模式",
      position: 1
    },
    {
      year: "2012年",
      title: "《Double Fine Adventure》籌集超過330萬美元，成為里程碑",
      position: 2
    },
    {
      year: "2015年",
      title: "亞洲市場開始蓬勃發展",
      position: 3
    },
    {
      year: "現今",
      title: "全球化趨勢，多元平台並存",
      position: 4
    }
  ];

  return (
    <section className="py-16 bg-background">
      <div className="container">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-4">群眾募資發展歷程</h2>
          <p className="text-lg text-muted-foreground">
            見證數位遊戲群眾募資的重要里程碑
          </p>
        </div>
        
        <div className="relative max-w-6xl mx-auto">
          {/* Timeline line */}
          <div className="absolute top-1/2 left-0 right-0 h-0.5 bg-border transform -translate-y-1/2 z-0"></div>
          
          {/* Timeline events */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 relative z-10">
            {timelineEvents.map((event, index) => (
              <div key={index} className="flex flex-col items-center">
                {/* Timeline marker */}
                <div className="w-12 h-12 bg-primary rounded-lg flex items-center justify-center text-primary-foreground font-bold mb-4 shadow-lg">
                  {event.position}
                </div>
                
                {/* Event card */}
                <Card className="w-full max-w-xs h-32 flex flex-col">
                  <CardContent className="p-4 text-center flex-1 flex flex-col justify-between">
                    <h3 className="text-lg font-semibold text-primary mb-2">
                      {event.year}
                    </h3>
                    <p className="text-sm text-muted-foreground leading-relaxed">
                      {event.title}
                    </p>
                  </CardContent>
                </Card>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default TimelineSection;