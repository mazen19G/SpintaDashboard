import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import logo from "@/assets/icon.svg";
import { Button } from "@/components/ui/button";
import { confirmAnalysis } from "@/lib/mockApi";
import { toast } from "sonner";
import { ChevronDown, ChevronUp } from "lucide-react";
import { format } from "date-fns";

const PreviewScreen = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [isJsonExpanded, setIsJsonExpanded] = useState(false);
  const [viewMode, setViewMode] = useState<"timeline" | "json">("timeline");
  const [videoUrl, setVideoUrl] = useState<string>("");
  const [isConfirming, setIsConfirming] = useState(false);

  const matchData = location.state?.matchData;
  const analysisResult = location.state?.analysisResult;

  useEffect(() => {
    if (!matchData || !analysisResult) {
      navigate("/");
      return;
    }
    // Video is now served from public folder as static asset
  }, [matchData, analysisResult, navigate]);

  const handleConfirm = async () => {
    setIsConfirming(true);
    try {
      console.log("Saving match analysis...");
      console.log("Match Data:", matchData);
      console.log("Events JSON:", analysisResult.eventsJson);

      const result: any = await confirmAnalysis(matchData, analysisResult.eventsJson, videoUrl);

      console.log("Save result:", result);
      toast.success(result.message || "Match analysis saved successfully!");
      navigate("/");
    } catch (error) {
      console.error("Failed to save match analysis:", error);
      const errorMessage = error instanceof Error ? error.message : "Failed to save analysis";
      toast.error(errorMessage);
    } finally {
      setIsConfirming(false);
    }
  };

  const handleReanalyze = () => {
    navigate("/loading", { state: { matchData } });
  };

  if (!matchData || !analysisResult) {
    return null;
  }

  const formattedDate = matchData.matchDate ? format(matchData.matchDate, "dd/MM/yyyy") : "";
  const homeTeam = matchData.matchType === "home" ? "Your Team" : matchData.opponentName;
  const awayTeam = matchData.matchType === "away" ? "Your Team" : matchData.opponentName;

  // Helper function to get event type color
  const getEventTypeColor = (eventType: string) => {
    const colors: Record<string, string> = {
      "Starting XI": "bg-blue-500",
      "Pass": "bg-green-500",
      "Shot": "bg-red-500",
      "Duel": "bg-yellow-500",
      "Ball Recovery": "bg-purple-500",
      "Foul Committed": "bg-orange-500",
      "Carry": "bg-teal-500",
      "Pressure": "bg-pink-500",
      "Clearance": "bg-indigo-500",
      "Interception": "bg-cyan-500",
      "Substitution": "bg-gray-500",
      "Goal Keeper": "bg-amber-500",
    };
    return colors[eventType] || "bg-gray-400";
  };

  // Get events array from JSON
  const events = Array.isArray(analysisResult?.eventsJson)
    ? analysisResult.eventsJson
    : [];

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-card">
        <div className="container mx-auto px-6 py-6 flex justify-center">
          <img
            src={logo}
            alt="Logo"
            className="h-32 md:h-32 object-contain"
          />
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-6 py-12 max-w-5xl">
        <div className="text-center mb-8">
          <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-4">
            Match Analysis Preview
          </h1>
          <p className="text-xl text-muted-foreground">
            {homeTeam} vs {awayTeam} - {formattedDate}
          </p>
        </div>

        {/* Video Preview Section */}
        <div className="bg-card rounded-2xl shadow-sm border border-border p-8 mb-6">
          <h2 className="text-2xl font-semibold text-foreground mb-4">
            Analyzed Match Video
          </h2>
          <div className="aspect-video bg-muted rounded-lg overflow-hidden">
            <video
              src="/output_video.mp4"
              controls
              className="w-full h-full object-contain"
            >
              Your browser does not support the video tag.
            </video>
          </div>
        </div>

        {/* Analysis Data Section */}
        <div className="bg-card rounded-2xl shadow-sm border border-border p-8 mb-8">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-semibold text-foreground">
              Analysis Data
            </h2>
            <div className="flex gap-2">
              <Button
                variant={viewMode === "timeline" ? "default" : "outline"}
                size="sm"
                onClick={() => setViewMode("timeline")}
              >
                Timeline
              </Button>
              <Button
                variant={viewMode === "json" ? "default" : "outline"}
                size="sm"
                onClick={() => setViewMode("json")}
              >
                JSON
              </Button>
            </div>
          </div>

          {viewMode === "timeline" ? (
            <div className="space-y-3 max-h-[600px] overflow-y-auto pr-2">
              {events.length > 0 ? (
                events.slice(0, 50).map((event: any, index: number) => (
                  <div
                    key={event.id || index}
                    className="bg-muted rounded-lg p-4 border border-border hover:border-primary transition-colors"
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <span
                            className={`${getEventTypeColor(
                              event.type?.name
                            )} text-white text-xs font-semibold px-2 py-1 rounded`}
                          >
                            {event.type?.name || "Unknown"}
                          </span>
                          <span className="text-sm font-mono text-muted-foreground">
                            {event.timestamp || `${event.minute}:${String(event.second).padStart(2, "0")}`}
                          </span>
                          <span className="text-sm text-muted-foreground">
                            Period {event.period}
                          </span>
                        </div>
                        {event.player && (
                          <p className="text-sm font-medium text-foreground">
                            {event.player.name}
                          </p>
                        )}
                        {event.team && (
                          <p className="text-xs text-muted-foreground">
                            {event.team.name}
                          </p>
                        )}
                        {event.tactics?.formation && (
                          <p className="text-xs text-muted-foreground mt-1">
                            Formation: {event.tactics.formation}
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-center text-muted-foreground py-8">
                  No events found in analysis data
                </p>
              )}
              {events.length > 50 && (
                <p className="text-center text-sm text-muted-foreground py-4">
                  Showing first 50 of {events.length} events
                </p>
              )}
            </div>
          ) : (
            <div className="bg-muted rounded-lg p-6 overflow-auto max-h-[600px]">
              <pre className="text-sm text-foreground font-mono">
                {JSON.stringify(analysisResult.eventsJson, null, 2)}
              </pre>
            </div>
          )}
        </div>

        {/* Action Buttons */}
        <div className="space-y-4">
          <Button
            onClick={handleConfirm}
            disabled={isConfirming}
            className="w-full gradient-button text-lg font-semibold py-6"
          >
            {isConfirming ? "Confirming..." : "Confirm & Save Analysis"}
          </Button>
          <Button
            onClick={handleReanalyze}
            variant="outline"
            className="w-full text-base py-6 text-[#FF3000]"
          >
            Re-analyze Match
          </Button>
        </div>
      </main>
    </div>
  );
};

export default PreviewScreen;
