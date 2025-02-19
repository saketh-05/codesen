import { NextResponse } from "next/server";
import axios from "axios";

export async function POST(req: Request) {
  try {
    const { role, question, answer } = await req.json();

    const prompt = question
      ? `Evaluate this answer: ${answer} for the question: ${question}`
      : `Generate an interview question for a ${role}`;

    const payload = {
      model: "llama-3.3-70b-versatile",
      messages: [{ role: "user", content: prompt }],
      max_tokens: 200,
    };

    // Use API key securely from environment variables
    const API_KEY = "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";
    if (!API_KEY) throw new Error("Missing API Key");

    const response = await axios.post(
      "https://api.groq.com/openai/v1/chat/completions",
      payload,
      {
        headers: {
          Authorization: `Bearer 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`,
          "Content-Type": "application/json",
        },
      }
    );

    const content = response.data.choices?.[0]?.message?.content || "No response from Groq";

    return NextResponse.json(
      question ? { feedback: content } : { question: content }
    );
  } catch (error: any) {
    console.error("Error communicating with Groq API:", error?.response?.data || error.message);
    return NextResponse.json(
      { error: "Failed to fetch response from Groq API" },
      { status: error?.response?.status || 500 }
    );
  }
}
