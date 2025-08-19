"use client"

import { MagnifyingGlassIcon } from "@heroicons/react/24/solid"
import { motion } from "framer-motion"
import React from "react"

const NoResults = () => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="flex flex-col items-center justify-center py-8 text-gray-500 dark:text-gray-400"
    >
      <MagnifyingGlassIcon className="w-8 h-8 mb-2 text-gray-300 dark:text-gray-600" />
      <p className="text-sm">No results found.</p>
    </motion.div>
  )
}

export default NoResults