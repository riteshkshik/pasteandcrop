import { motion, AnimatePresence } from "framer-motion";
import { X, Download, Copy } from "lucide-react";
import { Button } from "./Button";

export function ResultModal({ isOpen, onClose, imageSrc, onCopySuccess }) {
    if (!isOpen) return null;

    return (
        <AnimatePresence>
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
                onClick={onClose}
            >
                <motion.div
                    initial={{ scale: 0.95, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    exit={{ scale: 0.95, opacity: 0 }}
                    onClick={(e) => e.stopPropagation()}
                    className="bg-white rounded-3xl shadow-2xl max-w-lg w-full overflow-hidden flex flex-col"
                >
                    <div className="p-6 border-b border-gray-100 flex items-center justify-between">
                        <h3 className="text-lg font-semibold">Cropped Image</h3>
                        <button
                            onClick={onClose}
                            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                        >
                            <X className="w-5 h-5 text-gray-500" />
                        </button>
                    </div>

                    <div className="p-6 flex flex-col items-center gap-6">
                        <div className="relative rounded-xl overflow-hidden border border-gray-200 bg-gray-50">
                            <img src={imageSrc} alt="Cropped result" className="max-h-[50vh] object-contain" />
                        </div>

                        <div className="text-center space-y-2">
                            <p className="text-sm font-medium text-gray-900">
                                Automatic copy failed (browser restriction)
                            </p>
                            <p className="text-sm text-gray-500">
                                Long press the image to Copy or Save, or use the button below.
                            </p>
                        </div>

                        <div className="flex gap-3 w-full">
                            <Button
                                className="flex-1"
                                onClick={async () => {
                                    try {
                                        const response = await fetch(imageSrc);
                                        const blob = await response.blob();
                                        await navigator.clipboard.write([
                                            new ClipboardItem({
                                                [blob.type]: blob,
                                            }),
                                        ]);
                                        if (onCopySuccess) onCopySuccess();
                                        onClose();
                                    } catch (err) {
                                        console.error("Failed to copy", err);
                                        // Fallback to download if copy fails
                                        const link = document.createElement("a");
                                        link.href = imageSrc;
                                        link.download = "cropped-image.png";
                                        link.click();
                                    }
                                }}
                            >
                                <Copy className="w-4 h-4" />
                                Copy Image
                            </Button>
                            <Button
                                variant="secondary"
                                className="flex-1"
                                onClick={() => {
                                    const link = document.createElement("a");
                                    link.href = imageSrc;
                                    link.download = "cropped-image.png";
                                    link.click();
                                }}
                            >
                                <Download className="w-4 h-4" />
                                Download
                            </Button>
                        </div>
                    </div>
                </motion.div>
            </motion.div>
        </AnimatePresence>
    );
}
