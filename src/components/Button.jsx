import { motion } from "framer-motion";
import { cn } from "../lib/utils";

export function Button({ className, variant = "primary", children, ...props }) {
    const variants = {
        primary: "bg-black text-white hover:bg-gray-800 shadow-lg hover:shadow-xl",
        secondary: "bg-white text-gray-900 border border-gray-200 hover:bg-gray-50 shadow-sm hover:shadow-md",
        danger: "bg-red-50 text-red-600 hover:bg-red-100 border border-red-200",
    };

    return (
        <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className={cn(
                "px-6 py-3 rounded-2xl font-medium transition-all duration-200 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed",
                variants[variant],
                className
            )}
            {...props}
        >
            {children}
        </motion.button>
    );
}
