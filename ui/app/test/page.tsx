"use client"
import React from 'react'
import { motion } from 'framer-motion'


const draw = {
    hidden: { pathLength: 0, opacity: 0 },
    visible: {
        pathLength : 1, 
        opacity: 1,
        transition: {
            pathLength: { delay: 1, type: "spring", duration: 1.5, bounce: 0 },
            opacity: { delay: 1, duration: 0.01 }
          }
    }
}

export default function Page() {
    return (
       <main className='flex flex-1'>
            <motion.svg
                width="600"
                height="600"
                viewBox="0 0 600 600"
                initial="hidden"
                animate="visible"
            >
                <motion.circle
                    cx={200}
                    cy={100}
                    r={80}
                    fill={"#771fff"}
                    strokeWidth={6}
                    variants={draw}
                />
                <motion.text
                    x="10" y="40" font-family="Arial" font-size="40" fill="white"
                    variants={draw}
                >
                    mar
                </motion.text>
            </motion.svg>
            <svg width="200" height="100" xmlns="http://www.w3.org/2000/svg">

                <line x1="20" y1="80" x2="40" y2="40" stroke="white" stroke-width="10" />
                <line x1="40" y1="40" x2="60" y2="80" stroke="white" stroke-width="10" />


                <line x1="70" y1="40" x2="90" y2="80" stroke="white" stroke-width="10" />
                <line x1="90" y1="80" x2="110" y2="40" stroke="white" stroke-width="10" />
                <line x1="80" y1="60" x2="100" y2="60" stroke="white" stroke-width="10" />


                <line x1="120" y1="40" x2="120" y2="80" stroke="white" stroke-width="10" />
                <line x1="120" y1="40" x2="140" y2="40" stroke="white" stroke-width="10" />
                <line x1="140" y1="40" x2="160" y2="60" stroke="white" stroke-width="10" />
                <line x1="160" y1="60" x2="140" y2="80" stroke="white" stroke-width="10" />
            </svg>

       </main>
    )
}
