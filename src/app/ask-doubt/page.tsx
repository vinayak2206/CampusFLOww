"use client";

import { useState } from "react";

export default function AskDoubtPage() {
  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit() {
    if (!question.trim()) return;

    setLoading(true);
    setAnswer("");
    setError("");

    try {
      const res = await fetch("/api/ask-doubt", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ question }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "AI failed");
      }

      setAnswer(data.answer);
    } catch (err: any) {
      setError(err.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="p-8 max-w-3xl mx-auto space-y-6 bg-card rounded-xl shadow">
      <h1 className="text-2xl font-bold">Ask a Doubt</h1>

      <p className="text-muted-foreground">
        Type your doubt and get an instant AI explanation.
      </p>

      <textarea
        className="w-full border p-3 rounded min-h-[120px]"
        placeholder="Type your doubt here..."
        value={question}
        onChange={(e) => setQuestion(e.target.value)}
      />

      <button
        onClick={handleSubmit}
        disabled={loading}
        className="bg-black text-white px-6 py-2 rounded disabled:opacity-60"
      >
        {loading ? "Thinking..." : "Ask AI"}
      </button>

      {loading && (
        <p className="text-sm text-muted-foreground">Solving your doubt...</p>
      )}

      {error && <p className="text-sm text-red-500">{error}</p>}

      {answer && (
        <div className="border rounded p-4 bg-gray-50">
          <h2 className="font-semibold mb-2">Answer</h2>
          <p className="whitespace-pre-wrap">{answer}</p>
        </div>
      )}
    </div>
  );
}
