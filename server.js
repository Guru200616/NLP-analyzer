const express = require("express");
const path = require("path");
const cors = require("cors");
const Sentiment = require("sentiment");
const sw = require("stopword");

const app = express();
const sentiment = new Sentiment();

const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, "public")));

// Helper: basic keyword extraction
function extractKeywords(text, topN = 8) {
  const words = text
    .toLowerCase()
    .replace(/[^\w\s]/g, " ")
    .split(/\s+/)
    .filter(Boolean);

  // Remove stopwords
  const filtered = sw.removeStopwords(words);

  const freq = {};
  filtered.forEach((w) => {
    freq[w] = (freq[w] || 0) + 1;
  });

  const sorted = Object.entries(freq)
    .sort((a, b) => b[1] - a[1])
    .slice(0, topN)
    .map(([word, count]) => ({ word, count }));

  return sorted;
}

// Helper: reading time (approx 200 words/min)
function estimateReadingTime(wordCount) {
  const minutes = wordCount / 200;
  return Math.max(0.1, Number(minutes.toFixed(2)));
}

// API route
app.post("/api/analyze", (req, res) => {
  const { text } = req.body;

  if (!text || !text.trim()) {
    return res.status(400).json({ error: "Text is required for analysis." });
  }

  const cleanText = text.trim();

  // Sentiment
  const sentimentResult = sentiment.analyze(cleanText);

  let sentimentLabel = "Neutral";
  if (sentimentResult.score > 1) sentimentLabel = "Positive";
  else if (sentimentResult.score < -1) sentimentLabel = "Negative";

  // Basic stats
  const words = cleanText.split(/\s+/).filter(Boolean);
  const wordCount = words.length;
  const charCount = cleanText.length;
  const readingTime = estimateReadingTime(wordCount);

  // Keywords
  const keywords = extractKeywords(cleanText);

  res.json({
    sentiment: {
      score: sentimentResult.score,
      comparative: sentimentResult.comparative,
      label: sentimentLabel
    },
    stats: {
      wordCount,
      charCount,
      readingTimeMinutes: readingTime
    },
    keywords
  });
});

// Fallback to index.html
app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
