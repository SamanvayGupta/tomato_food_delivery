import { useState } from "react";
import { GoogleGenerativeAI } from "@google/generative-ai";

const apiKey = import.meta.env.VITE_GEMINI_API_KEY;

const genAI = new GoogleGenerativeAI(apiKey);
const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

export default function SeoAssistant() {
  const [topic, setTopic] = useState("");
  const [result, setResult] = useState("");
  const [loading, setLoading] = useState(false);

  const generateSEO = async () => {
    if (!topic.trim()) return;

    setLoading(true);

    const prompt = `
Generate SEO content for: "${topic}"

Return the response in this format:

SEO Keywords:
- (12 keywords)

Blog Title Ideas:
1)
2)
3)

Meta Description (under 155 characters):

Blog Outline:
1.
2.
3.
4.
(Keep it simple, student-friendly, and no ** formatting)
    `;

    try {
      const res = await model.generateContent(prompt);
      let text = res.response.text();

      text = text.replace(/\*\*/g, ""); // remove bold markdown

      setResult(text);
    } catch (error) {
      console.error(error);
      setResult("⚠️ Server is busy. Try again shortly.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <section id="seo-ai-tool" className="py-16 bg-background border-t border-border">
      <div className="max-w-3xl mx-auto px-4">
        <h2 className="text-3xl font-heading font-bold mb-6 text-primary">
          🍅 AI SEO Assistant
        </h2>

        <p className="text-muted-foreground mb-6">
          Generate blog keywords, meta descriptions & outlines using AI — optimized for TOMATO.
        </p>

        <div className="flex gap-2 mb-6">
          <input
            type="text"
            placeholder="Enter blog topic... e.g. 'Late night food near campus'"
            value={topic}
            onChange={(e) => setTopic(e.target.value)}
            className="flex-1 px-4 py-2 rounded-md border border-input bg-background text-foreground"
          />
          <button
            onClick={generateSEO}
            disabled={loading}
            className="px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary-dark transition-colors"
          >
            {loading ? "Generating..." : "Generate"}
          </button>
        </div>

        {result && (
          <div className="bg-card border border-border p-4 rounded-lg whitespace-pre-wrap leading-7 text-foreground">
            {result}
          </div>
        )}
      </div>
    </section>
  );
}
