"use client";
import { useState } from "react";
import axios from "axios";

export default function Home() {
  const [role, setRole] = useState("Frontend Developer");
  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState("");
  const [feedback, setFeedback] = useState("");
  const [history, setHistory] = useState([]);

  const getQuestion = async () => {
    const res = await axios.post("/api/groq", { role });
    setQuestion(res.data.question);
    setFeedback("");
    setAnswer("");
  };

  const submitAnswer = async () => {
    const res = await axios.post("/api/groq", { question, answer });
    setFeedback(res.data.feedback);
    setHistory([...history, { question, answer, feedback: res.data.feedback }]);
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 p-6">
      <h1 className="text-3xl font-bold text-gray-900 mb-4">AI Interview Agent</h1>
      
      <select className="p-2 border text-gray-900 rounded-md mb-4" value={role} onChange={(e) => setRole(e.target.value)}>
        <option>Frontend Developer</option>
        <option>Backend Developer</option>
        <option>Data Scientist</option>
      </select>

      <button className="px-4 py-2 bg-blue-600 text-white font-semibold rounded-md" onClick={getQuestion}>
        Get Interview Question
      </button>

      {question && (
        <div className="mt-4 p-4 bg-white shadow-md rounded-md w-full max-w-md">
          <p className="text-lg font-semibold text-gray-900">{question}</p>
          <textarea
            className="w-full p-2 border text-gray-900 rounded-md mt-2"
            rows={3}
            placeholder="Your Answer..."
            value={answer}
            onChange={(e) => setAnswer(e.target.value)}
          />
          <button className="mt-2 px-4 py-2 bg-green-600 text-white font-semibold rounded-md" onClick={submitAnswer}>
            Submit Answer
          </button>
          {feedback && <p className="mt-2 text-green-700 font-semibold">{feedback}</p>}
        </div>
      )}

      {history.length > 0 && (
        <div className="mt-6 w-full max-w-md bg-white p-4 shadow-md rounded-md">
          <h2 className="text-xl font-semibold text-gray-900">Interview History</h2>
          {history.map((item, index) => (
            <div key={index} className="border-b py-2">
              <p className="font-semibold text-gray-900">{item.question}</p>
              <p className="text-gray-900">{item.answer}</p>
              <p className="text-green-700 font-semibold">{item.feedback}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
