"use client"

import { motion } from "framer-motion"
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts"

interface AnimatedChartProps {
  data: any[]
  lines: {
    key: string
    color: string
    name: string
  }[]
  XAxisKey: string
  height?: number
}

export function AnimatedChart({ data, lines, XAxisKey, height = 300 }: AnimatedChartProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6 }}
      className="w-full"
    >
      <ResponsiveContainer width="100%" height={height}>
        <LineChart
          data={data}
          margin={{
            top: 20,
            right: 30,
            left: 20,
            bottom: 10,
          }}
        >
          <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
          <XAxis dataKey={XAxisKey} tick={{ fill: "#888888" }} tickLine={{ stroke: "#888888" }} />
          <YAxis tick={{ fill: "#888888" }} tickLine={{ stroke: "#888888" }} />
          <Tooltip
            contentStyle={{
              backgroundColor: "rgba(255, 255, 255, 0.9)",
              border: "none",
              borderRadius: "8px",
              boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
            }}
          />
          {lines.map((line, index) => (
            <Line
              key={line.key}
              type="monotone"
              dataKey={line.key}
              name={line.name}
              stroke={line.color}
              strokeWidth={2}
              dot={{ fill: line.color, r: 4 }}
              activeDot={{ r: 6, strokeWidth: 2 }}
              animationDuration={1500 + index * 500}
              animationBegin={index * 500}
            />
          ))}
        </LineChart>
      </ResponsiveContainer>
    </motion.div>
  )
}

