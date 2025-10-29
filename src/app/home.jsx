import React from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { Rabbit } from "lucide-react";

export function Home() {
  const navigate = useNavigate();

  return (
    <div className="relative flex flex-col items-center justify-center min-h-[80vh] overflow-hidden m-0 p-0">
      {/* === CONTENU === */}
      <div className="relative z-10 text-center">
        {/* Titre principal */}
        <motion.h1
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
          className="text-6xl text-white drop-shadow-[0_0_25px_rgba(255,255,255,0.3)] mb-12"
        >
          Bienvenue dans{" "}
          <span className="text-orange-400 drop-shadow-[0_0_25px_rgba(251,146,60,0.8)]">
            The Mind
          </span>
        </motion.h1>
        <div className="flex justify-center">
          <motion.button
            onClick={() => navigate("/rooms")}
            whileHover={{
              scale: 1.1,
              boxShadow: "0 0 60px rgba(251,146,60,0.9)",
            }}
            whileTap={{ scale: 0.95 }}
            className="relative flex items-center justify-center gap-5 px-20 py-10 text-4xl font-bold text-white rounded-full 
                       bg-gradient-to-r from-orange-500 via-orange-400 to-yellow-400
                       shadow-[0_0_60px_rgba(251,146,60,0.5)] transition-all duration-300 overflow-hidden"
          >
            {/* halo d’énergie */}
            <motion.div
              className="absolute justify-center inset-0 rounded-full bg-orange-400 blur-3xl opacity-40"
              animate={{
                scale: [1, 1.3, 1],
                opacity: [0.3, 0.6, 0.3],
              }}
              transition={{
                repeat: Infinity,
                duration: 2.5,
                ease: "easeInOut",
              }}
            />
            <Rabbit className="w-12 h-12 relative z-10 animate-bounce" />
            <span className="relative z-10 tracking-widest">JOUER</span>
          </motion.button>
        </div>
        <style>
          {`
          @keyframes twinkle {
            0%, 100% { opacity: 0.15; }
            50% { opacity: 0.3; }
          }
          .animate-twinkle {
            animation: twinkle 4s infinite ease-in-out;
          }
          body, html {
            margin: 0;
            padding: 0;
            background: black;
            overflow: hidden;
          }
        `}
        </style>
      </div>
    </div>
  );
}
