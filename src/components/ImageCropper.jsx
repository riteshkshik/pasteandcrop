import { useState, useRef, useEffect } from "react";
import ReactCrop, { centerCrop, makeAspectCrop } from "react-image-crop";
import "react-image-crop/dist/ReactCrop.css";
import { motion } from "framer-motion";
import { Check, X } from "lucide-react";
import { Button } from "./Button";
import { getCroppedImg } from "../lib/cropUtils";

function centerAspectCrop(mediaWidth, mediaHeight, aspect) {
    return centerCrop(
        makeAspectCrop(
            {
                unit: "%",
                width: 90,
            },
            aspect,
            mediaWidth,
            mediaHeight
        ),
        mediaWidth,
        mediaHeight
    );
}

export function ImageCropper({ imageSrc, onCropComplete, onCancel }) {
    const [crop, setCrop] = useState();
    const [completedCrop, setCompletedCrop] = useState();
    const [isProcessing, setIsProcessing] = useState(false);
    const imgRef = useRef(null);

    function onImageLoad(e) {
        const { width, height } = e.currentTarget;
        // Default to a centered crop
        const initialCrop = centerAspectCrop(width, height, 16 / 9);
        // Remove aspect requirement for free cropping
        delete initialCrop.aspect;
        setCrop(initialCrop);
    }

    const handleCrop = async () => {
        if (!completedCrop || !imgRef.current) return;

        setIsProcessing(true);
        try {
            // We need to scale the crop coordinates relative to the actual image size
            // vs the displayed image size
            const image = imgRef.current;
            const scaleX = image.naturalWidth / image.width;
            const scaleY = image.naturalHeight / image.height;

            const pixelCrop = {
                x: completedCrop.x * scaleX,
                y: completedCrop.y * scaleY,
                width: completedCrop.width * scaleX,
                height: completedCrop.height * scaleY,
            };

            const croppedImage = await getCroppedImg(imageSrc, pixelCrop);
            onCropComplete(croppedImage);
        } catch (e) {
            console.error(e);
        } finally {
            setIsProcessing(false);
        }
    };

    useEffect(() => {
        const handleKeyDown = (e) => {
            if ((e.metaKey || e.ctrlKey) && e.key === "c") {
                e.preventDefault(); // Prevent default copy behavior
                if (completedCrop?.width && !isProcessing) {
                    handleCrop();
                }
            }
        };

        window.addEventListener("keydown", handleKeyDown);
        return () => window.removeEventListener("keydown", handleKeyDown);
    }, [completedCrop, isProcessing]);

    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="w-full max-w-4xl mx-auto space-y-6"
        >
            <div className="relative min-h-[400px] w-full bg-gray-100 rounded-3xl overflow-hidden shadow-xl border border-gray-200 flex items-center justify-center p-8">
                <ReactCrop
                    crop={crop}
                    onChange={(_, percentCrop) => setCrop(percentCrop)}
                    onComplete={(c) => setCompletedCrop(c)}
                    className="max-h-[70vh]"
                >
                    <img
                        ref={imgRef}
                        src={imageSrc}
                        alt="Crop me"
                        onLoad={onImageLoad}
                        className="max-w-full max-h-[70vh] object-contain"
                    />
                </ReactCrop>
            </div>

            <div className="flex flex-col items-center gap-4">
                <div className="flex items-center justify-center gap-3 p-6 bg-white rounded-3xl shadow-sm border border-gray-100 w-full sm:w-auto">
                    <Button variant="secondary" onClick={onCancel}>
                        <X className="w-4 h-4" />
                        Clear
                    </Button>
                    <Button onClick={handleCrop} disabled={isProcessing || !completedCrop?.width}>
                        <Check className="w-4 h-4" />
                        Copy Cropped Image
                    </Button>
                </div>
                <p className="text-sm text-gray-400">
                    Press <span className="font-medium text-gray-600">Cmd + C</span> or <span className="font-medium text-gray-600">Ctrl + C</span> to copy
                </p>
            </div>
        </motion.div>
    );
}
