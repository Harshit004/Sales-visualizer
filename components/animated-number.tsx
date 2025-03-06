"use client"

import { useEffect, useRef } from "react"
import { useInView, useSpring, useMotionValue } from "framer-motion"

interface AnimatedNumberProps {
  value: number
  prefix?: string
  suffix?: string
  duration?: number
}

export function AnimatedNumber({ value, prefix = "", suffix = "", duration = 1 }: AnimatedNumberProps) {
  const ref = useRef<HTMLSpanElement>(null)
  const inView = useInView(ref, { once: true })
  const motionValue = useMotionValue(0)
  const springValue = useSpring(motionValue, {
    duration: duration * 1000,
    bounce: 0,
  })

  useEffect(() => {
    if (inView) {
      motionValue.set(value)
    }
  }, [inView, value, motionValue])

  useEffect(() => {
    return springValue.on("change", (latest) => {
      if (ref.current) {
        ref.current.textContent = prefix + latest.toFixed(2) + suffix
      }
    })
  }, [springValue, prefix, suffix])

  return <span ref={ref}>{prefix + "0" + suffix}</span>
}

