"use client"
import React from 'react'
import { motion } from 'framer-motion'


const svgDraw = {
    hidden: { rotate: 0 },
    visible: {
        rotate: 0,
        transition: { duration: 1 }
    }
}

const pathDraw = {
    hidden: { pathLength: 0, opacity: 0 },
    visible: {
        pathLength: 1,
        opacity: 1,
        transition: {
            duration: 3,
            ease: "easeInOut"
        }
    }
}

export default function Page() {
    return (
        <main className='flex flex-1 justify-center items-center'>
            <motion.svg variants={svgDraw} initial="hidden" animate="visible" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" className="w-[200px] h-[200px]">
                <motion.path variants={pathDraw} stroke-linecap="round" stroke-linejoin="round" d="M17.25 6.75L22.5 12l-5.25 5.25m-10.5 0L1.5 12l5.25-5.25m7.5-3l-4.5 16.5" />
            </motion.svg>


        </main>
    )
}
