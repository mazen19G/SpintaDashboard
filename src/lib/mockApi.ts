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

// PLACEHOLDER: Confirm Analysis Function
export async function confirmAnalysis(matchData: any, eventsJson: any, analyzedVideoUrl: string) {
  // TODO: Replace with actual backend call in future
  // const response = await fetch('/api/matches/confirm', {
  //   method: 'POST',
  //   headers: {
  //     'Content-Type': 'application/json'
  //   },
  //   body: JSON.stringify({
  //     match_data: matchData,
  //     events: eventsJson,
  //     video_url: analyzedVideoUrl
  //   })
  // });
  // return await response.json();
  
  // TEMPORARY: Log data and show success
  console.log('=== PLACEHOLDER: Would send to backend ===');
  console.log('Match Data:', matchData);
  console.log('Events JSON:', eventsJson);
  console.log('Video URL:', analyzedVideoUrl);
  console.log('==========================================');
  
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        success: true,
        message: 'Match analysis confirmed (placeholder)',
        match_id: eventsJson.match_id
      });
    }, 1000);
  });
}
