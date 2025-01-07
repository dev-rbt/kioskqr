"use client";

import { motion } from 'framer-motion';

interface PageTitleProps {
  title: string;
}

export function PageTitle({ title }: PageTitleProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="text-center mb-8"
    >
      <h1 className="text-4xl font-bold mb-4">{title}</h1>
      <div className="h-1 w-20 bg-primary rounded-full mx-auto"></div>
    </motion.div>
  );
}
