# NLP Text Analyzer

A simple Natural Language Processing (NLP) web app built with **Node.js**, **Express**, and **vanilla JavaScript**.

It analyzes any text you input and shows:

- 🔍 Sentiment (Positive / Negative / Neutral)
- 🧮 Word & character count
- ⏱️ Estimated reading time
- 🏷️ Top keywords (simple frequency-based extraction)

## 🚀 Tech Stack

- Node.js + Express
- Sentiment analysis using the `sentiment` npm package
- Keyword extraction using `stopword` + custom logic
- Frontend: HTML, CSS, JavaScript (Fetch API)

## 📦 Installation

```bash
git clone https://github.com/your-username/nlp-text-analyzer.git
cd nlp-text-analyzer
npm install
npm start
