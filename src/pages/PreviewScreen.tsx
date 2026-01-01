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
  const [videoUrl, setVideoUrl] = useState<string>("");
  const [isConfirming, setIsConfirming] = useState(false);

  const matchData = location.state?.matchData;
  const analysisResult = location.state?.analysisResult;

  useEffect(() => {
    if (!matchData || !analysisResult) {
      navigate("/");
      return;
    }

    // Create video URL from File object
    if (analysisResult.analyzedVideo) {
      const url = URL.createObjectURL(analysisResult.analyzedVideo);
      setVideoUrl(url);
      return () => URL.revokeObjectURL(url);
    }
  }, [matchData, analysisResult, navigate]);

  const handleConfirm = async () => {
    setIsConfirming(true);
    try {
      const result: any = await confirmAnalysis(matchData, analysisResult.eventsJson, videoUrl);
      toast.success(result.message || "Match analysis confirmed successfully!");
      navigate("/");
    } catch (error) {
      toast.error("Failed to confirm analysis");
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
            {videoUrl && (
              <video
                src={videoUrl}
                controls
                className="w-full h-full object-contain"
              >
                Your browser does not support the video tag.
              </video>
            )}
          </div>
        </div>

        {/* JSON Output Preview */}
        <div className="bg-card rounded-2xl shadow-sm border border-border p-8 mb-8">
          <button
            onClick={() => setIsJsonExpanded(!isJsonExpanded)}
            className="w-full flex items-center justify-between text-left mb-4"
          >
            <h2 className="text-2xl font-semibold text-foreground">
              Analysis Data (JSON)
            </h2>
            {isJsonExpanded ? (
              <ChevronUp className="w-6 h-6 text-muted-foreground" />
            ) : (
              <ChevronDown className="w-6 h-6 text-muted-foreground" />
            )}
          </button>
          
          {isJsonExpanded && (
            <div className="bg-muted rounded-lg p-6 overflow-auto max-h-96">
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
