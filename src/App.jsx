import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ImageUploader } from "./components/ImageUploader";
import { ImageCropper } from "./components/ImageCropper";
import { ResultModal } from "./components/ResultModal";
import { HistoryDrawer } from "./components/HistoryDrawer";
import { useImageHistory } from "./hooks/useImageHistory";
import { CheckCircle2, History } from "lucide-react";

function App() {
  const [imageSrc, setImageSrc] = useState(null);
  const [toast, setToast] = useState(null);
  const [resultModalOpen, setResultModalOpen] = useState(false);
  const [croppedImageSrc, setCroppedImageSrc] = useState(null);
  const [historyOpen, setHistoryOpen] = useState(false);
  const { history, addToHistory, clearHistory, removeFromHistory } = useImageHistory();

  const handleImageSelect = (src) => {
    setImageSrc(src);
  };

  const handleCropComplete = async (croppedImageBlobUrl) => {
    try {
      const response = await fetch(croppedImageBlobUrl);
      const blob = await response.blob();

      await navigator.clipboard.write([
        new ClipboardItem({
          [blob.type]: blob,
        }),
      ]);

      showToast("Cropped image copied to clipboard 🎉");
      addToHistory(croppedImageBlobUrl);
    } catch (error) {
      console.error("Failed to copy:", error);
      // Fallback: Show modal
      setCroppedImageSrc(croppedImageBlobUrl);
      setResultModalOpen(true);
    }
  };

  const showToast = (message) => {
    setToast(message);
    setTimeout(() => setToast(null), 3000);
  };

  const handleClear = () => {
    setImageSrc(null);
    setCroppedImageSrc(null);
  };

  const handleHistoryCopy = async (base64Src) => {
    try {
      const response = await fetch(base64Src);
      const blob = await response.blob();
      await navigator.clipboard.write([
        new ClipboardItem({
          [blob.type]: blob,
        }),
      ]);
      showToast("Copied from history! 📋");
      setHistoryOpen(false);
    } catch (error) {
      console.error("Failed to copy from history:", error);
      showToast("Failed to copy image ❌");
    }
  };

  return (
    <div className="min-h-screen bg-white flex flex-col items-center justify-center p-4 sm:p-8 font-sans text-gray-900 selection:bg-black selection:text-white">
      <div className="w-full max-w-5xl mx-auto space-y-8">
        <header className="text-center space-y-2 relative">
          <div className="absolute right-0 top-0">
            <button
              onClick={() => setHistoryOpen(true)}
              className="p-2 hover:bg-gray-100 rounded-full transition-colors text-gray-500 hover:text-black"
              title="History"
            >
              <History className="w-6 h-6" />
            </button>
          </div>
          <h1 className="text-4xl font-bold tracking-tight">Paste & Crop</h1>
          <p className="text-gray-500">Simple, fast, and privacy-friendly image cropping.</p>
        </header>

        <main className="flex-1 w-full flex flex-col items-center justify-center min-h-[400px]">
          <AnimatePresence mode="wait">
            {!imageSrc ? (
              <ImageUploader key="uploader" onImageSelect={handleImageSelect} />
            ) : (
              <ImageCropper
                key="cropper"
                imageSrc={imageSrc}
                onCropComplete={handleCropComplete}
                onCancel={handleClear}
              />
            )}
          </AnimatePresence>
        </main>

        <footer className="text-center text-sm text-gray-400 py-8">
          <p>Press Cmd+V / Ctrl+V to paste anywhere</p>
        </footer>
      </div>

      <ResultModal
        isOpen={resultModalOpen}
        onClose={() => setResultModalOpen(false)}
        imageSrc={croppedImageSrc}
        onCopySuccess={() => addToHistory(croppedImageSrc)}
      />

      <HistoryDrawer
        isOpen={historyOpen}
        onClose={() => setHistoryOpen(false)}
        history={history}
        onCopy={handleHistoryCopy}
        onDelete={removeFromHistory}
        onClear={clearHistory}
      />

      <AnimatePresence>
        {toast && (
          <motion.div
            initial={{ opacity: 0, y: 50, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            className="fixed bottom-8 left-1/2 -translate-x-1/2 bg-black text-white px-6 py-3 rounded-full shadow-2xl flex items-center gap-3 z-50"
          >
            <CheckCircle2 className="w-5 h-5 text-green-400" />
            <span className="font-medium">{toast}</span>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default App;
