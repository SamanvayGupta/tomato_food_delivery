import dotenv from "dotenv";
dotenv.config();

import fetch from "node-fetch";

// ✅ Load Keys
const API_KEY = process.env.VITE_GEMINI_API_KEY;
const BLOGGER_ACCESS_TOKEN = process.env.BLOGGER_ACCESS_TOKEN;
const BLOG_ID = "560787323595186795";

// ✅ Blogger API Endpoint
const BLOGGER_API = `https://www.googleapis.com/blogger/v3/blogs/${BLOG_ID}/posts`;

const TOPICS = [
  "Top student budget meals that taste amazing",
  "Best late night food under ₹100 near hostels",
  "Why ordering food saves time in college life",
  "Smart snacking ideas during study sessions",
  "Food that boosts mood and reduces stress",
  "How to survive hostel food without suffering",
  "Top snacks to eat during exams"
];

async function generateBlogContent() {
  const topic = TOPICS[Math.floor(Math.random() * TOPICS.length)];

  const prompt = `
Write a blog titled "${topic}" in HTML ONLY.
Use <h2>, <p>, <ul>, <li>. No markdown (**), no code fences.
Style: friendly, fun, college student tone.
Include the brand TOMATO 2–3 times naturally.
Length: ~400 words.
`;

  const response = await fetch(
    `https://generativelanguage.googleapis.com/v1/models/gemini-pro:generateContent?key=${API_KEY}`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        contents: [{ parts: [{ text: prompt }] }]
      })
    }
  );

  const data = await response.json();

  // ✅ Fix: Extract text safely regardless of Gemini format
  let contentText = "";

  try {
    if (data.candidates?.[0]?.content?.parts?.[0]?.text) {
      contentText = data.candidates[0].content.parts[0].text;
    } else if (data.candidates?.[0]?.output_text) {
      contentText = data.candidates[0].output_text;
    }
  } catch (_) {}

  if (!contentText || contentText.trim().length < 50) {
    throw new Error("Gemini returned no usable blog content");
  }

  return { title: topic, content: contentText };
}

async function publishBlog(title, content) {
  const res = await fetch(BLOGGER_API, {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${BLOGGER_ACCESS_TOKEN}`,
      "Content-Type": "application/json"
    },
    body: JSON.stringify({ title, content })
  });

  const data = await res.json();
  if (data.error) throw new Error(data.error.message);

  console.log("✅ Blog Published:", data.url);
}

// ✅ Run Full Automation
async function main() {
  try {
    console.log("✨ Generating Blog...");
    const { title, content } = await generateBlogContent();
    await publishBlog(title, content);
  } catch (err) {
    console.error("❌ ERROR:", err.message);
  }
}

main();
