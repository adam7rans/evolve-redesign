'use client'
import React from 'react'
import { motion } from 'framer-motion'
import { ChevronDown } from 'lucide-react'

export default function ScrollDownArrow() {
  return (
    <motion.div
      className="fixed bottom-8 left-1/2 -translate-x-1/2 text-white"
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 1 }}
    >
      <motion.div
        animate={{ y: [0, 10, 0] }}
        transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
      >
        <ChevronDown size={32} />
      </motion.div>
    </motion.div>
  )
}
