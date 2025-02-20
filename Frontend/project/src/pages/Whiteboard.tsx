import { motion } from 'framer-motion';
import { PencilRuler, Plus, Eraser, RotateCcw, Download, Trash2 } from 'lucide-react';
import { useRef, useState, useEffect } from 'react';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';

interface WhiteboardProps {
  width: number;
  height: number;
}

function DrawingBoard({ width, height }: WhiteboardProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [context, setContext] = useState<CanvasRenderingContext2D | null>(null);
  const [color, setColor] = useState('#000000');
  const [lineWidth, setLineWidth] = useState(2);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, width, height);
    setContext(ctx);
  }, [width, height]);

  const startDrawing = (e: React.MouseEvent) => {
    if (!context) return;
    
    setIsDrawing(true);
    const rect = canvasRef.current?.getBoundingClientRect();
    if (!rect) return;
    
    context.beginPath();
    context.moveTo(
      e.clientX - rect.left,
      e.clientY - rect.top
    );
  };

  const draw = (e: React.MouseEvent) => {
    if (!isDrawing || !context || !canvasRef.current) return;

    const rect = canvasRef.current.getBoundingClientRect();
    context.lineTo(
      e.clientX - rect.left,
      e.clientY - rect.top
    );
    context.strokeStyle = color;
    context.lineWidth = lineWidth;
    context.lineCap = 'round';
    context.stroke();
  };

  const stopDrawing = () => {
    if (!context) return;
    setIsDrawing(false);
    context.closePath();
  };

  const clearCanvas = () => {
    if (!context || !canvasRef.current) return;
    context.fillStyle = '#ffffff';
    context.fillRect(0, 0, width, height);
  };

  const eraseMode = () => {
    setColor('#ffffff');
    setLineWidth(20);
  };

  const penMode = () => {
    setColor('#000000');
    setLineWidth(2);
  };

  const exportAsPDF = async () => {
    if (!canvasRef.current) return;

    const canvas = await html2canvas(canvasRef.current);
    const imgData = canvas.toDataURL('image/png');
    const pdf = new jsPDF();
    pdf.addImage(imgData, 'PNG', 10, 10, 180, 120);
    pdf.save('whiteboard.pdf');
  };

  return (
    <div className="relative">
      <div className="absolute top-4 left-4 flex items-center space-x-2 bg-white rounded-lg shadow-sm p-2">
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={penMode}
          className={`p-2 rounded ${color === '#000000' ? 'bg-gray-200' : 'hover:bg-gray-100'}`}
        >
          <PencilRuler className="w-5 h-5" />
        </motion.button>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={eraseMode}
          className={`p-2 rounded ${color === '#ffffff' ? 'bg-gray-200' : 'hover:bg-gray-100'}`}
        >
          <Eraser className="w-5 h-5" />
        </motion.button>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={clearCanvas}
          className="p-2 rounded hover:bg-gray-100"
        >
          <RotateCcw className="w-5 h-5" />
        </motion.button>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={exportAsPDF}
          className="p-2 rounded hover:bg-gray-100"
        >
          <Download className="w-5 h-5" />
        </motion.button>
      </div>
      <canvas
        ref={canvasRef}
        width={width}
        height={height}
        onMouseDown={startDrawing}
        onMouseMove={draw}
        onMouseUp={stopDrawing}
        onMouseLeave={stopDrawing}
        className="border border-gray-200 rounded-lg shadow-sm bg-white cursor-crosshair"
      />
    </div>
  );
}

export function Whiteboard() {
  const [boards, setBoards] = useState([
    { id: 1, title: 'Math Problem Solving' }
  ]);

  const addNewBoard = () => {
    const newBoard = {
      id: boards.length + 1,
      title: `Whiteboard ${boards.length + 1}`
    };
    setBoards([...boards, newBoard]);
  };

  const deleteBoard = (id: number) => {
    setBoards(boards.filter(board => board.id !== id));
  };

  return (
    <div className="space-y-8">
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={addNewBoard}
        className="px-4 py-2 bg-blue-500 text-white rounded-md"
      >
        <Plus className="w-5 h-5 inline mr-2" /> New Whiteboard
      </motion.button>
      <div className="grid grid-cols-1 gap-8">
        {boards.map((board) => (
          <motion.div
            key={board.id}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-gray-50 rounded-lg p-6 space-y-4 relative"
          >
            <h3 className="font-medium text-lg">{board.title}</h3>
            <DrawingBoard width={800} height={600} />
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => deleteBoard(board.id)}
              className="absolute top-4 right-4 p-2 bg-red-500 text-white rounded-md"
            >
              <Trash2 className="w-5 h-5" />
            </motion.button>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
