"use client"

import { useEffect, useState, useRef } from "react"
import { motion } from "framer-motion"
import {
  ResponsiveContainer,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  Area,
  ComposedChart,
  ReferenceArea,
  Legend,
} from "recharts"
import type { SalesData } from "@/lib/types"
import { prepareRevenueChartData } from "@/lib/chart-data"

interface RevenueChartProps {
  data: SalesData[]
  timeframe: string
}

export function RevenueChart({ data, timeframe }: RevenueChartProps) {
  const [chartData, setChartData] = useState<any[]>([])
  const [left, setLeft] = useState<string | null>(null)
  const [right, setRight] = useState<string | null>(null)
  const [refAreaLeft, setRefAreaLeft] = useState<string | null>(null)
  const [refAreaRight, setRefAreaRight] = useState<string | null>(null)
  const [top, setTop] = useState<number | 'auto'>('auto')
  const [bottom, setBottom] = useState<number | 'auto'>('auto')

  useEffect(() => {
    setChartData(prepareRevenueChartData(data, timeframe))
  }, [data, timeframe])

  const zoom = () => {
    if (refAreaLeft === refAreaRight || !refAreaRight) {
      setRefAreaLeft(null)
      setRefAreaRight(null)
      return
    }

    if (refAreaLeft && refAreaRight) {
      let leftIdx = chartData.findIndex(item => item.date === refAreaLeft)
      let rightIdx = chartData.findIndex(item => item.date === refAreaRight)
      
      if (leftIdx > rightIdx) 
        [leftIdx, rightIdx] = [rightIdx, leftIdx]

      const relevantData = chartData.slice(leftIdx, rightIdx + 1)
      const maxValue = Math.max(...relevantData.map(d => d.revenue))
      const minValue = Math.min(...relevantData.map(d => d.revenue))
      
      setRefAreaLeft(null)
      setRefAreaRight(null)
      setLeft(refAreaLeft)
      setRight(refAreaRight)
      setBottom(minValue * 0.95)
      setTop(maxValue * 1.05)
    }
  }

  const zoomOut = () => {
    setLeft(null)
    setRight(null)
    setTop('auto')
    setBottom('auto')
    setRefAreaLeft(null)
    setRefAreaRight(null)
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="relative h-[600px] w-full"
    >
      <button
        onClick={zoomOut}
        className={`absolute top-4 right-4 z-10 rounded-md bg-white px-3 py-2 text-sm font-medium text-gray-700 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 ${
          !left ? 'invisible' : ''
        }`}
      >
        Reset Zoom
      </button>
      
      <ResponsiveContainer width="100%" height="100%">
        <ComposedChart
          data={chartData}
          margin={{ top: 20, right: 30, left: 60, bottom: 20 }}
          onMouseDown={e => e?.activeLabel && setRefAreaLeft(e.activeLabel)}
          onMouseMove={e => refAreaLeft && e?.activeLabel && setRefAreaRight(e.activeLabel)}
          onMouseUp={zoom}
        >
          <defs>
            <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#4f46e5" stopOpacity={0.3} />
              <stop offset="95%" stopColor="#4f46e5" stopOpacity={0.1} />
            </linearGradient>
            <filter id="shadow" height="200%">
              <feDropShadow dx="2" dy="2" stdDeviation="3" floodColor="#4f46e5" floodOpacity="0.1"/>
            </filter>
            <linearGradient id="colorRevenueStroke" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#4f46e5" />
              <stop offset="100%" stopColor="#818cf8" />
            </linearGradient>
          </defs>
          <CartesianGrid 
            strokeDasharray="3 3" 
            vertical={true} 
            stroke="#f0f0f0" 
            opacity={0.5} 
          />
          <XAxis
            dataKey="date"
            tick={{ fill: "#888888" }}
            tickLine={{ stroke: "#888888" }}
            domain={[left || 'auto', right || 'auto']}
            label={{
              value: "Month/Year",
              position: "insideBottom",
              offset: -10,
              fill: "#888888"
            }}
          />
          <YAxis
            tickFormatter={(value) => `₹${value}L`}
            domain={[bottom, top]}
            tick={{ fill: "#888888" }}
            tickLine={{ stroke: "#888888" }}
            label={{
              value: "Revenue (₹ Lakh)",
              angle: -90,
              position: "insideLeft",
              offset: -45,
              fill: "#888888"
            }}
          />
          <Tooltip
            formatter={(value: number) => [`₹${value.toFixed(2)} Lakh`, "Revenue"]}
            labelFormatter={(label) => `Period: ${label}`}
            contentStyle={{
              backgroundColor: "rgba(255, 255, 255, 0.95)",
              border: "none",
              borderRadius: "8px",
              boxShadow: "0 8px 16px rgba(0, 0, 0, 0.15)",
              padding: "12px 16px"
            }}
            cursor={{ stroke: "#4f46e5", strokeWidth: 1, strokeDasharray: "5 5" }}
          />
          <Legend 
            verticalAlign="top" 
            height={36}
          />
          {refAreaLeft && refAreaRight ? (
            <ReferenceArea
              x1={refAreaLeft}
              x2={refAreaRight}
              strokeOpacity={0.3}
              fill="#4f46e5"
              fillOpacity={0.1}
            />
          ) : null}
          <Area
            name="Monthly Revenue"
            type="monotone"
            dataKey="revenue"
            stroke="url(#colorRevenueStroke)"
            strokeWidth={3}
            fillOpacity={1}
            fill="url(#colorRevenue)"
            dot={{ 
              fill: "#4f46e5", 
              r: 4,
              strokeWidth: 2,
              stroke: "#fff",
              filter: "url(#shadow)"
            }}
            activeDot={{ 
              r: 8, 
              strokeWidth: 2,
              stroke: "#fff",
              fill: "#4f46e5"
            }}
            animationDuration={2000}
            isAnimationActive={true}
          />
        </ComposedChart>
      </ResponsiveContainer>
    </motion.div>
  )
}

