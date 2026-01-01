import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import logo from "@/assets/LOGO.png";
import { analyzeMatch } from "@/lib/mockApi";
import { Loader2 } from "lucide-react";

const loadingMessages = [
  "Analyzing match...",
  "Processing video footage...",
  "Detecting player movements...",
  "Identifying match events...",
  "Extracting statistics...",
  "Almost there...",
];

const LoadingScreen = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [messageIndex, setMessageIndex] = useState(0);
  const matchData = location.state?.matchData;

  useEffect(() => {
    if (!matchData) {
      navigate("/");
      return;
    }

    // Rotate messages every 2.5 seconds
    const messageInterval = setInterval(() => {
      setMessageIndex((prev) => (prev + 1) % loadingMessages.length);
    }, 2500);

    // Start analysis
    analyzeMatch(matchData.matchVideo, matchData).then((result) => {
      navigate("/preview", {
        state: {
          matchData,
          analysisResult: result,
        },
      });
    });

    return () => clearInterval(messageInterval);
  }, [matchData, navigate]);

  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center px-6">
      {/* Logo */}
      <img
        src={logo}
        alt="Logo"
        className="h-28 md:h-32 object-contain mb-12"
      />

      {/* Loading Spinner */}
      <div className="relative mb-8">
        <Loader2 className="w-16 h-16 text-primary animate-spin" 
          style={{
            background: 'linear-gradient(135deg, hsl(var(--accent)), hsl(var(--primary)))',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text',
          }}
        />
      </div>

      {/* Dynamic Loading Text */}
      <p className="text-xl md:text-2xl font-medium text-foreground text-center animate-fade-in">
        {loadingMessages[messageIndex]}
      </p>
    </div>
  );
};

export default LoadingScreen;
