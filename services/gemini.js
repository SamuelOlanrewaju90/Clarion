const { geminiKey, models } = require("../config");

const SYSTEM_PROMPT =
  "You are a helpful assistant. Analyze the user question carefully and give a clear, accurate, concise answer. Your knowledge may be out of date, so for questions about current events, prices, rankings or office holders, say your information may be outdated and suggest checking a live source. Today is " + new Date().toDateString() + ".";

async function callModel(model, question) {
  const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent`;
  const res = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json", "x-goog-api-key": geminiKey },
    signal: AbortSignal.timeout(20000),
    body: JSON.stringify({
      systemInstruction: { parts: [{ text: SYSTEM_PROMPT }] },
      contents: [{ role: "user", parts: [{ text: question }] }],
    }),
  });
  const data = await res.json();
  if (!res.ok) {
    const err = new Error(data.error?.message || "Gemini request failed");
    err.status = res.status;
    throw err;
  }
  return data.candidates?.[0]?.content?.parts?.[0]?.text || "No answer returned.";
}

async function askGemini(question) {
  let lastError;
  for (const model of models) {
    try {
      return await callModel(model, question);
    } catch (err) {
      lastError = err;
      const retryable = !err.status || [429, 500, 503, 504].includes(err.status);
      if (!retryable) break;
    }
  }
  throw lastError;
}

module.exports = { askGemini };
