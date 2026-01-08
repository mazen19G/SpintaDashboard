// PLACEHOLDER: Match Analysis Function
export async function analyzeMatch(videoFile: File, matchData: any) {
  // TODO: Replace with actual backend call in future
  // const formData = new FormData();
  // formData.append('video', videoFile);
  // formData.append('match_data', JSON.stringify(matchData));
  // 
  // const response = await fetch('/api/analyze-match', {
  //   method: 'POST',
  //   body: formData
  // });
  // return await response.json();
  
  // TEMPORARY: Return mock data
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        analyzedVideo: videoFile, // Return original video unchanged
        eventsJson: {
          match_id: `match_${Date.now()}`,
          timestamp: new Date().toISOString(),
          events: [
            { type: "goal", time: "23:45", team: "home", player: "Player #10", confidence: 0.95 },
            { type: "foul", time: "35:12", team: "away", player: "Player #7", confidence: 0.87 },
            { type: "corner", time: "42:30", team: "home", confidence: 0.92 },
            { type: "yellow_card", time: "56:18", team: "away", player: "Player #5", confidence: 0.98 }
          ],
          summary: {
            total_events: 4,
            goals: 1,
            fouls: 1,
            corners: 1,
            cards: 1
          }
        }
      });
    }, 5000); // Simulate 5 second processing time
  });
}

// Save Match Analysis with JWT Authentication
export async function confirmAnalysis(matchData: any, eventsJson: any, analyzedVideoUrl: string) {
  console.log("=== confirmAnalysis called ===");
  console.log("matchData:", matchData);
  console.log("eventsJson sample:", Array.isArray(eventsJson) ? `Array with ${eventsJson.length} events` : eventsJson);

  // Get JWT token from localStorage
  const token = localStorage.getItem("auth_token");
  console.log("Auth token present:", !!token);

  if (!token) {
    throw new Error("Authentication required. Please log in again.");
  }

  // Create FormData for multipart/form-data request
  const formData = new FormData();

  // Add match fields
  const opponentName = matchData.opponentName || "";
  formData.append("opponent_name", opponentName);
  console.log("opponent_name:", opponentName);

  // Format match_date to YYYY-MM-DD
  const matchDate = matchData.matchDate
    ? new Date(matchData.matchDate).toISOString().split('T')[0]
    : "";
  formData.append("match_date", matchDate);
  console.log("match_date:", matchDate);

  // Home = Our Team, Away = Opponent Team
  const ourScore = matchData.homeScore || "0";
  const opponentScore = matchData.awayScore || "0";
  formData.append("our_score", ourScore);
  formData.append("opponent_score", opponentScore);
  console.log("our_score:", ourScore, "opponent_score:", opponentScore);

  // Create JSON file from eventsJson and append as file
  const jsonBlob = new Blob([JSON.stringify(eventsJson, null, 2)], {
    type: "application/json",
  });
  const jsonFile = new File([jsonBlob], "analysis_events.json", {
    type: "application/json",
  });
  formData.append("events_file", jsonFile);
  console.log("events_file size:", jsonBlob.size, "bytes");

  console.log("Sending POST to:", "https://spinta-backend.vercel.app/api/coach/matches");

  // Send POST request to backend
  const response = await fetch("https://spinta-backend.vercel.app/api/coach/matches", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      // Note: Don't set Content-Type for FormData, browser sets it automatically with boundary
    },
    body: formData,
  });

  console.log("Response status:", response.status);

  if (!response.ok) {
    const errorText = await response.text();
    console.error("Error response:", errorText);

    let errorData;
    try {
      errorData = JSON.parse(errorText);
    } catch {
      errorData = { message: errorText };
    }

    throw new Error(errorData.message || `Failed to save match analysis (${response.status})`);
  }

  const result = await response.json();
  console.log("Success response:", result);
  return result;
}
