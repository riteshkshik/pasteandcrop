import { motion, AnimatePresence } from "framer-motion";
import { X, Copy, Trash2, Clock } from "lucide-react";
import { Button } from "./Button";

export function HistoryDrawer({ isOpen, onClose, history, onCopy, onDelete, onClear }) {
    return (
        <AnimatePresence>
            {isOpen && (
                <>
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                        className="fixed inset-0 z-40 bg-black/20 backdrop-blur-sm"
                    />
                    <motion.div
                        initial={{ x: "100%" }}
                        animate={{ x: 0 }}
                        exit={{ x: "100%" }}
                        transition={{ type: "spring", damping: 25, stiffness: 200 }}
                        className="fixed right-0 top-0 bottom-0 z-50 w-full max-w-md bg-white shadow-2xl flex flex-col"
                    >
                        <div className="p-6 border-b border-gray-100 flex items-center justify-between bg-white/80 backdrop-blur-md sticky top-0 z-10">
                            <div className="flex items-center gap-2">
                                <Clock className="w-5 h-5 text-gray-500" />
                                <h2 className="text-xl font-semibold">History</h2>
                                <span className="text-xs font-medium px-2 py-1 bg-gray-100 rounded-full text-gray-500">
                                    {history.length} / 10
                                </span>
                            </div>
                            <div className="flex items-center gap-2">
                                {history.length > 0 && (
                                    <button
                                        onClick={onClear}
                                        className="text-xs font-medium text-red-500 hover:text-red-600 px-3 py-1.5 rounded-full hover:bg-red-50 transition-colors"
                                    >
                                        Clear All
                                    </button>
                                )}
                                <button
                                    onClick={onClose}
                                    className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                                >
                                    <X className="w-5 h-5 text-gray-500" />
                                </button>
                            </div>
                        </div>

                        <div className="flex-1 overflow-y-auto p-6 space-y-6">
                            {history.length === 0 ? (
                                <div className="h-full flex flex-col items-center justify-center text-gray-400 space-y-4">
                                    <Clock className="w-12 h-12 opacity-20" />
                                    <p>No history yet</p>
                                </div>
                            ) : (
                                history.map((item) => (
                                    <motion.div
                                        layout
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        exit={{ opacity: 0, scale: 0.9 }}
                                        key={item.id}
                                        className="group relative bg-gray-50 rounded-2xl overflow-hidden border border-gray-100 hover:shadow-md transition-all"
                                    >
                                        <div className="aspect-video w-full bg-gray-100 relative">
                                            <img
                                                src={item.src}
                                                alt="History item"
                                                className="w-full h-full object-contain p-2"
                                            />
                                        </div>

                                        <div className="p-4 flex items-center justify-between bg-white border-t border-gray-100">
                                            <span className="text-xs text-gray-400">
                                                {new Date(item.timestamp).toLocaleTimeString()}
                                            </span>
                                            <div className="flex items-center gap-2">
                                                <button
                                                    onClick={() => onDelete(item.id)}
                                                    className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-full transition-colors"
                                                    title="Delete"
                                                >
                                                    <Trash2 className="w-4 h-4" />
                                                </button>
                                                <Button
                                                    size="sm"
                                                    onClick={() => onCopy(item.src)}
                                                    className="flex items-center gap-2"
                                                >
                                                    <Copy className="w-3 h-3" />
                                                    Copy
                                                </Button>
                                            </div>
                                        </div>
                                    </motion.div>
                                ))
                            )}
                        </div>
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    );
}
