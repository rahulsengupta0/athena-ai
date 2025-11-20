import React from "react";
import { motion } from "framer-motion";

const MotionCard = ({ className, children }) => {
  return (
    <motion.div
      className={className}
      whileHover={{ y: -6, scale: 1.02 }}
      transition={{ type: "spring", stiffness: 260, damping: 20 }}
    >
      {children}
    </motion.div>
  );
};

export default MotionCard;