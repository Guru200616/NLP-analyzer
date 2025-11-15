const textInput = document.getElementById("textInput");
const analyzeBtn = document.getElementById("analyzeBtn");
const clearBtn = document.getElementById("clearBtn");
const errorMessage = document.getElementById("errorMessage");

const sentimentLabel = document.getElementById("sentimentLabel");
const sentimentScore = document.getElementById("sentimentScore");
const sentimentComparative = document.getElementById("sentimentComparative");

const wordCountEl = document.getElementById("wordCount");
const charCountEl = document.getElementById("charCount");
const readingTimeEl = document.getElementById("readingTime");
const keywordsList = document.getElementById("keywordsList");

async function analyzeText() {
  const text = textInput.value;

  errorMessage.textContent = "";

  if (!text.trim()) {
    errorMessage.textContent = "Please enter some text to analyze.";
    return;
  }

  try {
    const res = await fetch("/api/analyze", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ text })
    });

    if (!res.ok) {
      const data = await res.json();
      throw new Error(data.error || "Something went wrong.");
    }

    const data = await res.json();
    updateUI(data);
  } catch (err) {
    console.error(err);
    errorMessage.textContent = err.message || "Error analyzing text.";
  }
}

function updateUI(data) {
  const { sentiment, stats, keywords } = data;

  sentimentLabel.textContent = sentiment.label;
  sentimentScore.textContent = sentiment.score;
  sentimentComparative.textContent = sentiment.comparative.toFixed(3);

  wordCountEl.textContent = stats.wordCount;
  charCountEl.textContent = stats.charCount;
  readingTimeEl.textContent = stats.readingTimeMinutes.toFixed(2);

  keywordsList.innerHTML = "";

  if (!keywords.length) {
    const li = document.createElement("li");
    li.textContent = "No significant keywords found.";
    keywordsList.appendChild(li);
    return;
  }

  keywords.forEach((kw) => {
    const li = document.createElement("li");
    li.innerHTML = `${kw.word} <span class="count">×${kw.count}</span>`;
    keywordsList.appendChild(li);
  });
}

analyzeBtn.addEventListener("click", analyzeText);

clearBtn.addEventListener("click", () => {
  textInput.value = "";
  sentimentLabel.textContent = "–";
  sentimentScore.textContent = "–";
  sentimentComparative.textContent = "–";
  wordCountEl.textContent = "0";
  charCountEl.textContent = "0";
  readingTimeEl.textContent = "0";
  keywordsList.innerHTML = "<li>No keywords yet.</li>";
  errorMessage.textContent = "";
});
