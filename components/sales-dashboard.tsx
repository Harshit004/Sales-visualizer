"use client"

import { useEffect, useState, useRef, ReactNode } from "react"
import { motion } from "framer-motion"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { TopCustomersChart } from "@/components/charts/top-customers-chart"
import { ProductPerformanceChart } from "@/components/charts/product-performance-chart"
import { SalesRepPerformanceChart } from "@/components/charts/sales-rep-performance-chart"
import { PendingInvoicesChart } from "@/components/charts/pending-invoices-chart"
import { OrderPipelineChart } from "@/components/charts/order-pipeline-chart"
import { CustomerRetentionTable } from "@/components/charts/customer-retention-table"
import { AnimatedChart } from "@/components/animated-chart"
import { RegionSalesChart } from "@/components/charts/region-sales-chart"
import { RevenueForecastChart } from "@/components/charts/revenue-forecast-chart"
import { PaymentRealizationChart } from "@/components/charts/payment-realization-chart"
import { KpiCards } from "@/components/kpi-cards"
import { Logo } from "@/components/logo"
import { fetchSalesData } from "@/lib/data"
import type { SalesData } from "@/lib/types"
import dynamic from "next/dynamic"
import Link from "next/link"

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

// Lazy load chart components with loading options
const LazyTopCustomersChart = dynamic(() => import("@/components/charts/top-customers-chart").then(mod => ({ default: mod.TopCustomersChart })), { 
  ssr: false,
  loading: () => <div className="h-[300px] flex items-center justify-center bg-white/10 dark:bg-gray-900/10 border border-white/20 dark:border-gray-800/20 rounded-lg">
    <div className="animate-pulse h-full w-full" />
  </div>
})

const LazyRegionSalesChart = dynamic(() => import("@/components/charts/region-sales-chart").then(mod => ({ default: mod.RegionSalesChart })), { ssr: false })
const LazyProductPerformanceChart = dynamic(() => import("@/components/charts/product-performance-chart").then(mod => ({ default: mod.ProductPerformanceChart })), { ssr: false })
const LazySalesRepPerformanceChart = dynamic(() => import("@/components/charts/sales-rep-performance-chart").then(mod => ({ default: mod.SalesRepPerformanceChart })), { ssr: false })
const LazyPendingInvoicesChart = dynamic(() => import("@/components/charts/pending-invoices-chart").then(mod => ({ default: mod.PendingInvoicesChart })), { ssr: false })
const LazyOrderPipelineChart = dynamic(() => import("@/components/charts/order-pipeline-chart").then(mod => ({ default: mod.OrderPipelineChart })), { ssr: false })
const LazyCustomerRetentionTable = dynamic(() => import("@/components/charts/customer-retention-table").then(mod => ({ default: mod.CustomerRetentionTable })), { ssr: false })

// Split charts into groups for progressive loading
const SecondaryCharts = dynamic(() => import("@/components/chart-groups/secondary-charts").then(mod => ({ default: mod.SecondaryCharts })), {
  ssr: false,
  loading: () => <div className="animate-pulse h-[400px]" />
})

function ChartWrapper({ children, className = "" }: { children: ReactNode; className?: string }) {
  const [isVisible, setIsVisible] = useState(false)
  const ref = useRef(null)

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true)
          observer.disconnect()
        }
      },
      { threshold: 0.1 }
    )

    if (ref.current) {
      observer.observe(ref.current)
    }

    return () => observer.disconnect()
  }, [])

  return (
    <div ref={ref} className={className}>
      {isVisible ? children : <div className="h-[300px] flex items-center justify-center">Loading...</div>}
    </div>
  )
}

export function SalesDashboard() {
  const [salesData, setSalesData] = useState<SalesData[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [timeframe, setTimeframe] = useState("mtd")
  const [loadSecondaryCharts, setLoadSecondaryCharts] = useState(false)
  const secondaryChartsRef = useRef(null)

  useEffect(() => {
    const loadData = async () => {
      try {
        const data = await fetchSalesData()
        setSalesData(data)
      } catch (error) {
        console.error("Error loading sales data:", error)
      } finally {
        setIsLoading(false)
      }
    }

    loadData()
  }, [])

  useEffect(() => {
    const observerSecondary = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setLoadSecondaryCharts(true)
          observerSecondary.disconnect()
        }
      },
      { threshold: 0.1 }
    )

    if (secondaryChartsRef.current) {
      observerSecondary.observe(secondaryChartsRef.current)
    }

    return () => {
      observerSecondary.disconnect()
    }
  }, [])

  if (isLoading) {
    return (
      <div className="p-6 flex flex-col gap-6">
        <div className="flex items-center justify-between">
          <Logo />
          <div className="h-10 w-40 bg-muted animate-pulse rounded-md" />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {Array(4)
            .fill(0)
            .map((_, i) => (
              <div key={i} className="h-[120px] rounded-xl bg-muted animate-pulse" />
            ))}
        </div>
      </div>
    )
  }

  return (
    <motion.div className="flex flex-col gap-6 p-6" variants={container} initial="hidden" animate="show">
      <motion.div className="flex items-center justify-between" variants={item}>
        <Logo />
        <div className="flex items-center gap-4">
          <Link
            href="/forecast"
            className="inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border border-input bg-background hover:bg-accent hover:text-accent-foreground h-10 px-4 py-2"
          >
            View Forecast →
          </Link>
          <Tabs defaultValue="mtd" onValueChange={setTimeframe}>
            <TabsList>
              <TabsTrigger value="mtd">Month to Date</TabsTrigger>
              <TabsTrigger value="qtd">Quarter to Date</TabsTrigger>
              <TabsTrigger value="ytd">Year to Date</TabsTrigger>
            </TabsList>
          </Tabs>
        </div>
      </motion.div>

      <motion.div variants={item}>
        <KpiCards data={salesData} timeframe={timeframe} />
      </motion.div>

      <motion.div className="grid grid-cols-1 md:grid-cols-2 gap-6" variants={item}>
        <Card>
          <CardHeader>
            <CardTitle>Revenue Trend</CardTitle>
            <CardDescription>Monthly revenue performance over time</CardDescription>
          </CardHeader>
          <CardContent>
            <AnimatedChart
              data={salesData}
              lines={[
                { key: "Total Revenue (₹ Lakh)", color: "#4f46e5", name: "Revenue" },
                { key: "Profit (₹ Lakh)", color: "#10b981", name: "Profit" },
              ]}
              XAxisKey="Sales Order Date"
            />
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Sales by Region</CardTitle>
            <CardDescription>Revenue distribution across regions</CardDescription>
          </CardHeader>
          <CardContent>
            <ChartWrapper>
              <LazyRegionSalesChart data={salesData} />
            </ChartWrapper>
          </CardContent>
        </Card>
      </motion.div>

      <motion.div className="grid grid-cols-1 md:grid-cols-2 gap-6" variants={item}>
        <Card>
          <CardHeader>
            <CardTitle>Top Customers</CardTitle>
            <CardDescription>Highest revenue generating customers</CardDescription>
          </CardHeader>
          <CardContent>
            <ChartWrapper>
              <LazyTopCustomersChart data={salesData} />
            </ChartWrapper>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Product Performance</CardTitle>
            <CardDescription>Sales distribution by product</CardDescription>
          </CardHeader>
          <CardContent>
            <ChartWrapper>
              <LazyProductPerformanceChart data={salesData} />
            </ChartWrapper>
          </CardContent>
        </Card>
      </motion.div>

      <motion.div className="grid grid-cols-1 md:grid-cols-2 gap-6" variants={item}>
        <Card>
          <CardHeader>
            <CardTitle>Pending Invoices</CardTitle>
            <CardDescription>Aging analysis of outstanding payments</CardDescription>
          </CardHeader>
          <CardContent>
            <ChartWrapper>
              <LazyPendingInvoicesChart data={salesData} />
            </ChartWrapper>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Sales Rep Performance</CardTitle>
            <CardDescription>Revenue generated by sales representatives</CardDescription>
          </CardHeader>
          <CardContent>
            <ChartWrapper>
              <LazySalesRepPerformanceChart data={salesData} />
            </ChartWrapper>
          </CardContent>
        </Card>
      </motion.div>

      <motion.div className="grid grid-cols-1 md:grid-cols-2 gap-6" variants={item}>
        <Card>
          <CardHeader>
            <CardTitle>Order Pipeline</CardTitle>
            <CardDescription>Orders at different stages</CardDescription>
          </CardHeader>
          <CardContent>
            <ChartWrapper>
              <LazyOrderPipelineChart data={salesData} />
            </ChartWrapper>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Customer Retention</CardTitle>
            <CardDescription>Repeat purchase analysis</CardDescription>
          </CardHeader>
          <CardContent>
            <ChartWrapper>
              <LazyCustomerRetentionTable data={salesData} />
            </ChartWrapper>
          </CardContent>
        </Card>
      </motion.div>

      <div ref={secondaryChartsRef}>
        {loadSecondaryCharts && <SecondaryCharts data={salesData} />}
      </div>
    </motion.div>
  )
}

