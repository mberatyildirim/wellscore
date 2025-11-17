"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

// Loading screen component with mosaic background pattern and centered spinner
export function LoadingScreen() {
  // State to control when loading screen is visible
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Hide loading screen after a short delay once the page is ready
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 800);

    return () => clearTimeout(timer);
  }, []);

  return (
    <AnimatePresence>
      {isLoading && (
        <motion.div
          // Initial state: fully visible
          initial={{ opacity: 1 }}
          // Exit animation: fade out
          exit={{ opacity: 0 }}
          // Animation duration
          transition={{ duration: 0.4 }}
          // Fixed positioning to cover entire viewport with solid white background
          className="fixed inset-0 z-50 flex items-center justify-center bg-white"
          // Prevent scrolling while loading
          style={{ overflow: "hidden" }}
        >
          {/* Centered spinner */}
          <div className="flex flex-col items-center gap-4">
            {/* Rotating spinner circle */}
            <motion.div
              // Continuous rotation animation
              animate={{ rotate: 360 }}
              transition={{
                duration: 1,
                repeat: Infinity,
                ease: "linear",
              }}
              className="w-16 h-16 border-4 border-orange-100 border-t-orange-600 rounded-full"
            />
            
            {/* WellScore text */}
            <motion.p
              // Pulse animation for text
              animate={{ opacity: [0.5, 1, 0.5] }}
              transition={{
                duration: 1.5,
                repeat: Infinity,
                ease: "easeInOut",
              }}
              className="text-lg font-semibold text-orange-600"
            >
              WellScore
            </motion.p>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

