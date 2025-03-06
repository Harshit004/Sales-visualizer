"use client"

import { motion } from "framer-motion"
import { Card, CardContent } from "@/components/ui/card"
import { calculateKpis } from "@/lib/calculations"
import type { SalesData } from "@/lib/types"
import { AnimatedNumber } from "@/components/animated-number"
import { ArrowUpRight, TrendingUp, Package, CreditCard } from "lucide-react"

interface KpiCardsProps {
  data: SalesData[]
  timeframe: string
}

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
}

const item = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0 },
}

export function KpiCards({ data, timeframe }: KpiCardsProps) {
  const kpis = calculateKpis(data, timeframe)

  return (
    <motion.div
      variants={container}
      initial="hidden"
      animate="show"
      className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 p-6"
    >
      <motion.div variants={item}>
        <Card className="h-[140px] relative overflow-hidden backdrop-blur-sm bg-white/60 dark:bg-gray-800/60 hover:bg-white/70 dark:hover:bg-gray-800/70 border-white/50 dark:border-gray-700/50 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 hover:rotate-1 hover:translate-y-[-4px] before:absolute before:inset-0 before:bg-gradient-to-br before:from-blue-50/20 dark:before:from-blue-900/20 before:via-white/25 dark:before:via-gray-800/25 before:to-transparent before:opacity-0 hover:before:opacity-100 before:transition-opacity">
          <CardContent className="!p-6 h-full flex flex-col items-center justify-center text-center space-y-4">
            <div className="flex items-center justify-center w-full">
              <span className="text-sm font-medium text-muted-foreground dark:text-gray-300">Total Sales Revenue</span>
              <TrendingUp className="h-4 w-4 text-muted-foreground dark:text-gray-300 ml-2" />
            </div>
            <div className="flex items-baseline gap-2 justify-center text-gray-900 dark:text-white">
              <span className="text-2xl font-bold">₹</span>
              <AnimatedNumber value={kpis.totalRevenue} suffix=" Lakh" />
            </div>
            <div className="text-xs text-muted-foreground dark:text-gray-400">
              {kpis.revenueGrowth > 0 ? "+" : ""}
              <AnimatedNumber value={kpis.revenueGrowth} suffix="%" />
              {" from previous period"}
            </div>
          </CardContent>
        </Card>
      </motion.div>

      <motion.div variants={item}>
        <Card className="h-[140px] relative overflow-hidden backdrop-blur-sm bg-white/60 dark:bg-gray-800/60 hover:bg-white/70 dark:hover:bg-gray-800/70 border-white/50 dark:border-gray-700/50 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 hover:rotate-1 hover:translate-y-[-4px] before:absolute before:inset-0 before:bg-gradient-to-br before:from-blue-50/20 dark:before:from-blue-900/20 before:via-white/25 dark:before:via-gray-800/25 before:to-transparent before:opacity-0 hover:before:opacity-100 before:transition-opacity">
          <CardContent className="!p-6 h-full flex flex-col items-center justify-center text-center space-y-4">
            <div className="flex items-center justify-center w-full">
              <span className="text-sm font-medium text-muted-foreground dark:text-gray-300">Gross Margin</span>
              <ArrowUpRight className="h-4 w-4 text-muted-foreground dark:text-gray-300 ml-2" />
            </div>
            <div className="flex items-baseline gap-2 justify-center text-gray-900 dark:text-white">
              <AnimatedNumber value={kpis.grossMargin} suffix="%" />
            </div>
            <div className="text-xs text-muted-foreground dark:text-gray-400">
              {kpis.marginGrowth > 0 ? "+" : ""}
              <AnimatedNumber value={kpis.marginGrowth} suffix="%" />
              {" from previous period"}
            </div>
          </CardContent>
        </Card>
      </motion.div>

      <motion.div variants={item}>
        <Card className="h-[140px] relative overflow-hidden backdrop-blur-sm bg-white/60 dark:bg-gray-800/60 hover:bg-white/70 dark:hover:bg-gray-800/70 border-white/50 dark:border-gray-700/50 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 hover:rotate-1 hover:translate-y-[-4px] before:absolute before:inset-0 before:bg-gradient-to-br before:from-blue-50/20 dark:before:from-blue-900/20 before:via-white/25 dark:before:via-gray-800/25 before:to-transparent before:opacity-0 hover:before:opacity-100 before:transition-opacity">
          <CardContent className="!p-6 h-full flex flex-col items-center justify-center text-center space-y-4">
            <div className="flex items-center justify-center w-full">
              <span className="text-sm font-medium text-muted-foreground dark:text-gray-300">Avg. Order Value</span>
              <CreditCard className="h-4 w-4 text-muted-foreground dark:text-gray-300 ml-2" />
            </div>
            <div className="flex items-baseline gap-2 justify-center text-gray-900 dark:text-white">
              <span className="text-2xl font-bold">₹</span>
              <AnimatedNumber value={kpis.avgOrderValue} suffix=" Lakh" />
            </div>
            <div className="text-xs text-muted-foreground dark:text-gray-400">
              {kpis.aovGrowth > 0 ? "+" : ""}
              <AnimatedNumber value={kpis.aovGrowth} suffix="%" />
              {" from previous period"}
            </div>
          </CardContent>
        </Card>
      </motion.div>

      <motion.div variants={item}>
        <Card className="h-[140px] relative overflow-hidden backdrop-blur-sm bg-white/60 dark:bg-gray-800/60 hover:bg-white/70 dark:hover:bg-gray-800/70 border-white/50 dark:border-gray-700/50 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 hover:rotate-1 hover:translate-y-[-4px] before:absolute before:inset-0 before:bg-gradient-to-br before:from-blue-50/20 dark:before:from-blue-900/20 before:via-white/25 dark:before:via-gray-800/25 before:to-transparent before:opacity-0 hover:before:opacity-100 before:transition-opacity">
          <CardContent className="!p-6 h-full flex flex-col items-center justify-center text-center space-y-4">
            <div className="flex items-center justify-center w-full">
              <span className="text-sm font-medium text-muted-foreground dark:text-gray-300">Pending Orders</span>
              <Package className="h-4 w-4 text-muted-foreground dark:text-gray-300 ml-2" />
            </div>
            <div className="flex items-baseline gap-2 justify-center text-gray-900 dark:text-white">
              <AnimatedNumber value={kpis.pendingOrders} />
            </div>
            <div className="text-xs text-muted-foreground dark:text-gray-400">
              <AnimatedNumber value={kpis.pendingOrdersPercentage} suffix="%" />
              {" of total orders"}
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </motion.div>
  )
}

