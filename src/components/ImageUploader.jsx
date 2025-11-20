import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Upload, Image as ImageIcon, Command } from "lucide-react";
import { Button } from "./Button";
import { cn } from "../lib/utils";

export function ImageUploader({ onImageSelect }) {
    const fileInputRef = useRef(null);
    const [isDragging, setIsDragging] = useState(false);

    const handleFileChange = (e) => {
        const file = e.target.files?.[0];
        if (file) processFile(file);
    };

    const processFile = (file) => {
        if (!file.type.startsWith("image/")) return;
        const reader = new FileReader();
        reader.onload = () => onImageSelect(reader.result);
        reader.readAsDataURL(file);
    };

    const handlePaste = (e) => {
        const items = e.clipboardData?.items;
        if (!items) return;

        for (const item of items) {
            if (item.type.startsWith("image/")) {
                const file = item.getAsFile();
                if (file) processFile(file);
                break;
            }
        }
    };

    useEffect(() => {
        window.addEventListener("paste", handlePaste);
        return () => window.removeEventListener("paste", handlePaste);
    }, []);

    const handleDragOver = (e) => {
        e.preventDefault();
        setIsDragging(true);
    };

    const handleDragLeave = (e) => {
        e.preventDefault();
        setIsDragging(false);
    };

    const handleDrop = (e) => {
        e.preventDefault();
        setIsDragging(false);
        const file = e.dataTransfer.files?.[0];
        if (file) processFile(file);
    };

    const handleClickPaste = async () => {
        try {
            const clipboardItems = await navigator.clipboard.read();
            for (const item of clipboardItems) {
                const imageTypes = item.types.filter(type => type.startsWith('image/'));
                for (const type of imageTypes) {
                    const blob = await item.getType(type);
                    processFile(blob);
                    return;
                }
            }
        } catch (err) {
            console.error('Failed to read clipboard contents: ', err);
        }
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="w-full max-w-2xl mx-auto"
        >
            <div
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
                className={cn(
                    "relative group rounded-3xl border-2 border-dashed transition-all duration-300 p-12 text-center",
                    isDragging
                        ? "border-black bg-gray-50 scale-[1.02]"
                        : "border-gray-200 hover:border-gray-300 hover:bg-gray-50/50"
                )}
            >
                <div className="flex flex-col items-center justify-center gap-6">
                    <div className="p-4 bg-white rounded-2xl shadow-sm ring-1 ring-gray-100">
                        <ImageIcon className="w-8 h-8 text-gray-400" />
                    </div>

                    <div className="space-y-2 cursor-pointer" onClick={handleClickPaste}>
                        <h2 className="text-2xl font-semibold tracking-tight text-gray-900 hover:text-black transition-colors">
                            Click to paste Copied Image
                        </h2>
                        <p className="text-gray-500 flex items-center justify-center gap-2">
                            <Command className="w-4 h-4" /> + V / Ctrl + V
                        </p>
                    </div>

                    <div className="flex items-center gap-4 w-full justify-center">
                        <div className="h-px bg-gray-200 w-12" />
                        <span className="text-sm text-gray-400 font-medium">OR</span>
                        <div className="h-px bg-gray-200 w-12" />
                    </div>

                    <Button onClick={() => fileInputRef.current?.click()}>
                        <Upload className="w-4 h-4" />
                        Upload Image
                    </Button>

                    <input
                        ref={fileInputRef}
                        type="file"
                        accept="image/png, image/jpeg, image/jpg"
                        className="hidden"
                        onChange={handleFileChange}
                    />
                </div>
            </div>
        </motion.div>
    );
}
