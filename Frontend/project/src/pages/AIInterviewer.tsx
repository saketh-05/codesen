import { useState } from "react";
import { motion } from "framer-motion";
import { User, Play, Star, FileUp } from "lucide-react";
import axios from "axios";

const roles: string[] = [
  "Frontend Developer", "Backend Developer", "Data Scientist", "DevOps Engineer",
  "Mobile Developer", "Fullstack Developer", "Software Engineer", "QA Engineer",
  "UI/UX Designer", "Product Manager", "Technical Support", "Security Engineer"
];

interface InterviewHistory {
  question: string;
  answer: string;
  feedback: string;
}

export default function AIInterviewAgent() {
  const [role, setRole] = useState<string>("Frontend Developer");
  const [question, setQuestion] = useState<string>("");
  const [answer, setAnswer] = useState<string>("");
  const [feedback, setFeedback] = useState<string>("");
  const [history, setHistory] = useState<InterviewHistory[]>([]);
  const [pdfFile, setPdfFile] = useState<File | null>(null);

  // Fetch interview question
  const getQuestion = async (): Promise<void> => {
    try {
      const res = await axios.post("http://127.0.0.1:8000/api/groq", { role });
      setQuestion(res.data.question);
      setFeedback("");
      setAnswer("");
    } catch (error) {
      console.error("Error fetching question:", error);
    }
  };

  // Submit answer for evaluation
  const submitAnswer = async (): Promise<void> => {
    if (!question || !answer) return;
    try {
      const res = await axios.post("http://127.0.0.1:8000/api/groq", { question, answer });
      setFeedback(res.data.feedback);
      setHistory([...history, { question, answer, feedback: res.data.feedback }]);
    } catch (error) {
      console.error("Error submitting answer:", error);
    }
  };

  // Upload PDF and generate questions
  const handlePdfUpload = async (): Promise<void> => {
    if (!pdfFile) return;

    const formData = new FormData();
    formData.append("file", pdfFile);

    try {
      const res = await axios.post("http://127.0.0.1:8000/api/upload_pdf", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      setQuestion(res.data.question);
    } catch (error) {
      console.error("Error uploading PDF:", error);
    }
  };

  return (
    <div className="space-y-8 p-6 min-h-screen bg-gray-100 flex flex-col items-center">
      
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center space-x-3"
      >
        <User className="w-6 h-6" />
        <h1 className="text-2xl font-semibold">AI Interview Practice</h1>
      </motion.div>

      <p className="text-gray-600 text-center">
        Select a role or upload a PDF to generate AI-driven interview questions.
      </p>

      {/* PDF Upload */}
      <div className="bg-white rounded-lg shadow-md p-6 space-y-4 w-full max-w-md">
        <label className="block text-sm font-medium text-gray-700">Upload PDF:</label>
        <input
          type="file"
          accept="application/pdf"
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
            if (e.target.files) {
              setPdfFile(e.target.files[0]);
            }
          }}
          className="w-full border p-2 rounded-md"
        />
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className="flex items-center px-4 py-2 bg-indigo-600 text-white font-semibold rounded-md w-full justify-center"
          onClick={handlePdfUpload}
        >
          <FileUp className="w-5 h-5 mr-2" />
          Upload PDF
        </motion.button>
      </div>

      {/* Role Selection */}
      <div className="bg-white rounded-lg shadow-md p-6 space-y-4 w-full max-w-md">
        <label className="block text-sm font-medium text-gray-700">Select Role:</label>
        <select
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          value={role}
          onChange={(e) => setRole(e.target.value)}
        >
          {roles.map((role) => (
            <option key={role} value={role}>{role}</option>
          ))}
        </select>

        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className="flex items-center px-4 py-2 bg-blue-600 text-white font-semibold rounded-md w-full justify-center"
          onClick={getQuestion}
        >
          <Play className="w-5 h-5 mr-2" />
          Get Interview Question
        </motion.button>
      </div>

      {/* Question & Answer Section */}
      {question && (
        <div className="bg-white rounded-lg shadow-md p-6 space-y-4 w-full max-w-md">
          <h2 className="text-lg font-semibold">{question}</h2>
          <textarea
            className="w-full p-2 border text-gray-900 rounded-md"
            rows={3}
            placeholder="Your Answer..."
            value={answer}
            onChange={(e) => setAnswer(e.target.value)}
          />
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="px-4 py-2 bg-green-600 text-white font-semibold rounded-md w-full"
            onClick={submitAnswer}
          >
            Submit Answer
          </motion.button>
          {feedback && <p className="mt-2 text-green-700 font-semibold">{feedback}</p>}
        </div>
      )}

      {/* Interview History */}
      {history.length > 0 && (
        <div className="bg-white rounded-lg shadow-md p-6 space-y-4 w-full max-w-md">
          <h2 className="text-xl font-semibold flex items-center space-x-2">
            <Star className="w-5 h-5" />
            <span>Interview History</span>
          </h2>
          {history.map((item, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="border-b py-2"
            >
              <p className="font-semibold">{item.question}</p>
              <p className="text-gray-900">{item.answer}</p>
              <p className="text-green-700 font-semibold">{item.feedback}</p>
            </motion.div>
          ))}
        </div>
      )}

    </div>
  );
}
