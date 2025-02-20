import { motion } from "framer-motion";
import { PencilRuler, Plus } from "lucide-react";
import { useState, useEffect } from "react";
import DrawingBoard from "../DrawingBoard";

// Import react-pdf and pdfjs-dist
import { pdfjs } from "react-pdf";
// Set up the worker (make sure to install pdfjs-dist if you haven’t already)
pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.js`;

export function Whiteboard() {
  const [boards, setBoards] = useState([{ id: 1, title: "Math Problem Solving" }]);
  const [pdfFile, setPdfFile] = useState(null);
  const [pdfBackground, setPdfBackground] = useState("");

  const addNewBoard = () => {
    const newBoard = { id: boards.length + 1, title: `Whiteboard ${boards.length + 1}` };
    setBoards([...boards, newBoard]);
  };

  // When a PDF is selected, render its first page as an image and store as background
  useEffect(() => {
    if (pdfFile) {
      const fileReader = new FileReader();
      fileReader.readAsArrayBuffer(pdfFile);
      fileReader.onload = async (e) => {
        const typedArray = new Uint8Array(e.target.result);
        try {
          const pdf = await pdfjs.getDocument(typedArray).promise;
          const page = await pdf.getPage(1);
          const viewport = page.getViewport({ scale: 1.5 });
          const canvas = document.createElement("canvas");
          canvas.width = viewport.width;
          canvas.height = viewport.height;
          const ctx = canvas.getContext("2d");
          const renderContext = {
            canvasContext: ctx,
            viewport: viewport,
          };
          await page.render(renderContext).promise;
          const dataUrl = canvas.toDataURL();
          setPdfBackground(dataUrl);
        } catch (error) {
          console.error("Error rendering PDF page:", error);
        }
      };
    }
  }, [pdfFile]);

  return (
    <div className="flex space-x-4">
      {/* Left side: Whiteboard(s) */}
      <div className="flex-1 space-y-8">
        <div className="flex items-center justify-between">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-center space-x-3"
          >
            <PencilRuler className="w-6 h-6" />
            <h1 className="text-2xl font-semibold">Whiteboard</h1>
          </motion.div>

          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={addNewBoard}
            className="inline-flex items-center px-4 py-2 bg-black text-white rounded-md font-medium text-sm"
          >
            <Plus className="w-4 h-4 mr-2" />
            New Whiteboard
          </motion.button>
        </div>

        <div className="grid grid-cols-1 gap-8">
          {boards.map((board) => (
            <motion.div
              key={board.id}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-gray-50 rounded-lg p-6 space-y-4"
            >
              <h3 className="font-medium text-lg">{board.title}</h3>
              {/* Pass the pdfBackground prop into DrawingBoard */}
              <DrawingBoard width={800} height={600} pdfBackground={pdfBackground} />
            </motion.div>
          ))}
        </div>
      </div>

      {/* Right side: PDF Reader */}
      <div className="w-1/3 space-y-4">
        <h2 className="text-xl font-semibold">PDF Reader</h2>
        <input
          type="file"
          accept="application/pdf"
          onChange={(e) => {
            if (e.target.files?.[0]) {
              setPdfFile(e.target.files[0]);
            }
          }}
          className="block w-full p-2 border rounded"
        />
        {pdfBackground && (
          <div className="border rounded p-2">
            <img src={pdfBackground} alt="PDF Page Preview" className="w-full" />
          </div>
        )}
      </div>
    </div>
  );
}

export default Whiteboard;
