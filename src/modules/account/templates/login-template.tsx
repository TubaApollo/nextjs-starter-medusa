"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"

import Register from "@modules/account/components/register"
import Login from "@modules/account/components/login"

export enum LOGIN_VIEW {
  SIGN_IN = "sign-in",
  REGISTER = "register",
}

// Enhanced animation variants for professional industrial feel
const containerVariants = {
  initial: { 
    opacity: 0,
    scale: 0.95,
    y: 20
  },
  animate: { 
    opacity: 1,
    scale: 1,
    y: 0,
    transition: {
      duration: 0.4,
      ease: [0.4, 0.0, 0.2, 1], // Custom cubic-bezier for smooth professional feel
      staggerChildren: 0.1
    }
  },
  exit: { 
    opacity: 0,
    scale: 0.95,
    y: -20,
    transition: {
      duration: 0.3,
      ease: [0.4, 0.0, 0.2, 1]
    }
  }
}

const slideVariants = {
  fromLeft: {
    initial: { opacity: 0, x: -30, scale: 0.98 },
    animate: { opacity: 1, x: 0, scale: 1 },
    exit: { opacity: 0, x: 30, scale: 0.98 }
  },
  fromRight: {
    initial: { opacity: 0, x: 30, scale: 0.98 },
    animate: { opacity: 1, x: 0, scale: 1 },
    exit: { opacity: 0, x: -30, scale: 0.98 }
  }
}

const LoginTemplate = () => {
  const [currentView, setCurrentView] = useState("sign-in")

  return (
    <div className="w-full flex justify-center px-8 py-8 min-h-[600px]">
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ 
          duration: 0.6, 
          ease: [0.4, 0.0, 0.2, 1],
          delay: 0.1
        }}
        className="relative"
      >
        <AnimatePresence mode="wait">
          {currentView === "sign-in" ? (
            <motion.div
              key="login"
              variants={slideVariants.fromLeft}
              initial="initial"
              animate="animate"
              exit="exit"
              transition={{ 
                duration: 0.4, 
                ease: [0.4, 0.0, 0.2, 1] 
              }}
            >
              <Login setCurrentView={setCurrentView} />
            </motion.div>
          ) : (
            <motion.div
              key="register"
              variants={slideVariants.fromRight}
              initial="initial"
              animate="animate"
              exit="exit"
              transition={{ 
                duration: 0.4, 
                ease: [0.4, 0.0, 0.2, 1] 
              }}
            >
              <Register setCurrentView={setCurrentView} />
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  )
}

export default LoginTemplate
