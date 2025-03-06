"use client"

import { useEffect, useState } from "react"
import { motion } from "framer-motion"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { RevenueForecastChart } from "@/components/charts/revenue-forecast-chart"
import { PaymentRealizationChart } from "@/components/charts/payment-realization-chart"
import { fetchSalesData } from "@/lib/data"
import type { SalesData } from "@/lib/types"
import Link from "next/link"

export default function ForecastPage() {
  const [salesData, setSalesData] = useState<SalesData[]>([])
  const [isLoading, setIsLoading] = useState(true)

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

  if (isLoading) {
    return (
      <div className="p-6 flex flex-col gap-6">
        <div className="h-[400px] rounded-xl bg-muted animate-pulse" />
        <div className="h-[400px] rounded-xl bg-muted animate-pulse" />
      </div>
    )
  }

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-3xl font-bold">Sales Forecast</h1>
          <p className="text-muted-foreground">Revenue projections and payment realization analysis</p>
        </div>
        <Link 
          href="/dashboard" 
          className="inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border border-input bg-background hover:bg-accent hover:text-accent-foreground h-10 px-4 py-2"
        >
          ← Back to Dashboard
        </Link>
      </div>

      <div className="grid gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Revenue Forecast</CardTitle>
            <CardDescription>Projected revenue based on historical trends and pipeline data</CardDescription>
          </CardHeader>
          <CardContent className="h-[400px]">
            <RevenueForecastChart data={salesData} />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Payment Realization</CardTitle>
            <CardDescription>Expected payment realization in the next 30 days</CardDescription>
          </CardHeader>
          <CardContent className="h-[400px]">
            <PaymentRealizationChart data={salesData} />
          </CardContent>
        </Card>
      </div>
    </div>
  )
} 