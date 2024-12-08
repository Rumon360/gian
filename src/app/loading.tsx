"use client";

import React from "react";
import { Loader2 } from "lucide-react";
import { motion } from "motion/react";

function Loading() {
  return (
    <div className="absolute inset-0 flex justify-center items-center">
      <motion.div
        initial={{ rotate: "0deg" }}
        animate={{ rotate: "360deg" }}
        transition={{ duration: 1, ease: "linear", repeat: Infinity }}
      >
        <Loader2 className="" size={48} />
      </motion.div>
    </div>
  );
}

export default Loading;
