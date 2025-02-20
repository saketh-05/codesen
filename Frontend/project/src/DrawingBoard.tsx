import { motion } from "framer-motion";
import { PencilRuler, Eraser, RotateCcw, Type, Image, Download } from "lucide-react";
import { useRef, useState, useEffect } from "react";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";

interface WhiteboardProps {
  width: number;
  height: number;
  pdfBackground?: string; // new optional prop for PDF background image
}

interface TextBox {
  id: number;
  text: string;
  x: number;
  y: number;
}

interface ImageElement {
  id: number;
  src: string;
  x: number;
  y: number;
  width: number;
  height: number;
}

function DrawingBoard({ width, height, pdfBackground }: WhiteboardProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [context, setContext] = useState<CanvasRenderingContext2D | null>(null);
  const [color, setColor] = useState("#000000");
  const [lineWidth, setLineWidth] = useState(2);
  const [textBoxes, setTextBoxes] = useState<TextBox[]>([]);
  const [images, setImages] = useState<ImageElement[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Set up the canvas on mount (or when width/height change)
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Fill canvas with white background (this drawing is separate from the CSS background)
    ctx.fillStyle = "#ffffff";
    ctx.fillRect(0, 0, width, height);
    setContext(ctx);
  }, [width, height]);

  // When pdfBackground changes, update the canvas CSS background image
  useEffect(() => {
    if (canvasRef.current && pdfBackground) {
      canvasRef.current.style.backgroundImage = `url(${pdfBackground})`;
      canvasRef.current.style.backgroundSize = "contain";
      canvasRef.current.style.backgroundRepeat = "no-repeat";
      canvasRef.current.style.backgroundPosition = "center";
    } else if (canvasRef.current) {
      canvasRef.current.style.backgroundImage = "";
    }
  }, [pdfBackground]);

  const startDrawing = (e: React.MouseEvent) => {
    if (!context) return;
    setIsDrawing(true);
    const rect = canvasRef.current?.getBoundingClientRect();
    if (!rect) return;
    context.beginPath();
    context.moveTo(e.clientX - rect.left, e.clientY - rect.top);
  };

  const draw = (e: React.MouseEvent) => {
    if (!isDrawing || !context || !canvasRef.current) return;
    const rect = canvasRef.current.getBoundingClientRect();
    context.lineTo(e.clientX - rect.left, e.clientY - rect.top);
    context.strokeStyle = color;
    context.lineWidth = lineWidth;
    context.lineCap = "round";
    context.stroke();
  };

  const stopDrawing = () => {
    if (!context) return;
    setIsDrawing(false);
    context.closePath();
  };

  const clearCanvas = () => {
    if (!context || !canvasRef.current) return;
    // When clearing, reapply the white fill.
    context.fillStyle = "#ffffff";
    context.fillRect(0, 0, width, height);
    setTextBoxes([]);
    setImages([]);
  };

  const eraseMode = () => {
    setColor("#ffffff");
    setLineWidth(20);
  };

  const penMode = () => {
    setColor("#000000");
    setLineWidth(2);
  };

  const addTextBox = () => {
    setTextBoxes([...textBoxes, { id: Date.now(), text: "Type here...", x: 100, y: 100 }]);
  };

  const updateTextBox = (id: number, text: string) => {
    setTextBoxes(textBoxes.map((box) => (box.id === id ? { ...box, text } : box)));
  };

  const handleTextDrag = (id: number, x: number, y: number) => {
    setTextBoxes(textBoxes.map((box) => (box.id === id ? { ...box, x, y } : box)));
  };

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      if (e.target?.result) {
        setImages([
          ...images,
          { id: Date.now(), src: e.target.result as string, x: 150, y: 150, width: 200, height: 150 },
        ]);
      }
    };
    reader.readAsDataURL(file);
  };

  const handleImageDrag = (id: number, x: number, y: number) => {
    setImages(images.map((img) => (img.id === id ? { ...img, x, y } : img)));
  };

  const saveAsPDF = async () => {
    const canvas = await html2canvas(document.getElementById("whiteboard-container") as HTMLElement);
    const pdf = new jsPDF("p", "mm", "a4");
    const imgData = canvas.toDataURL("image/png");

    pdf.addImage(imgData, "PNG", 10, 10, 190, 100);
    pdf.save("whiteboard.pdf");
  };

  return (
    <div className="relative" id="whiteboard-container">
      <div className="absolute top-4 left-4 flex items-center space-x-2 bg-white rounded-lg shadow-sm p-2">
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={penMode}
          className="p-2 rounded hover:bg-gray-100"
        >
          <PencilRuler className="w-5 h-5" />
        </motion.button>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={eraseMode}
          className="p-2 rounded hover:bg-gray-100"
        >
          <Eraser className="w-5 h-5" />
        </motion.button>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={addTextBox}
          className="p-2 rounded hover:bg-gray-100"
        >
          <Type className="w-5 h-5" />
        </motion.button>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => fileInputRef.current?.click()}
          className="p-2 rounded hover:bg-gray-100"
        >
          <Image className="w-5 h-5" />
        </motion.button>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={saveAsPDF}
          className="p-2 rounded hover:bg-gray-100"
        >
          <Download className="w-5 h-5" />
        </motion.button>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={clearCanvas}
          className="p-2 rounded hover:bg-gray-100"
        >
          <RotateCcw className="w-5 h-5" />
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

      {textBoxes.map((box) => (
        <motion.input
          key={box.id}
          value={box.text}
          onChange={(e) => updateTextBox(box.id, e.target.value)}
          drag
          onDrag={(e, info) => handleTextDrag(box.id, info.point.x, info.point.y)}
          className="absolute bg-transparent border-b border-black text-black text-lg font-medium"
          style={{ left: box.x, top: box.y }}
        />
      ))}

      {images.map((img) => (
        <motion.img
          key={img.id}
          src={img.src}
          alt="uploaded"
          drag
          onDrag={(e, info) => handleImageDrag(img.id, info.point.x, info.point.y)}
          className="absolute"
          style={{ left: img.x, top: img.y, width: img.width, height: img.height }}
        />
      ))}

      <input
        type="file"
        ref={fileInputRef}
        className="hidden"
        accept="image/*"
        onChange={handleImageUpload}
      />
    </div>
  );
}

export default DrawingBoard;
