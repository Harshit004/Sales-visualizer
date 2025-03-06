"use client"

import { useEffect, useRef } from "react"
import type { SalesData } from "@/lib/types"
import { preparePendingInvoicesData } from "@/lib/chart-data"
import dynamic from "next/dynamic"
import { Loader2 } from "lucide-react"

interface PendingInvoicesChartProps {
  data: SalesData[]
}

const ChartComponent = ({ data }: PendingInvoicesChartProps) => {
  const chartDiv = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (typeof window === "undefined") return

    let chart: any = null
    let observer: MutationObserver | null = null

    const initChart = async () => {
      if (!chartDiv.current) return

      try {
        const [am4core, am4charts, am4themes_animated] = await Promise.all([
          import("@amcharts/amcharts4/core").then(m => m.default || m),
          import("@amcharts/amcharts4/charts").then(m => m.default || m),
          import("@amcharts/amcharts4/themes/animated").then(m => m.default || m)
        ])

        // Apply theme
        am4core.useTheme(am4themes_animated)

        // Create chart
        chart = am4core.create(chartDiv.current as HTMLDivElement, am4charts.XYChart3D)

        // Set data
        const chartData = preparePendingInvoicesData(data)
        chart.data = chartData

        // 3D settings
        chart.angle = 30
        chart.depth = 40

        // Create axes
        const categoryAxis = chart.xAxes.push(new am4charts.CategoryAxis())
        categoryAxis.dataFields.category = "ageGroup"
        categoryAxis.renderer.grid.template.location = 0
        categoryAxis.renderer.minGridDistance = 30
        categoryAxis.renderer.labels.template.horizontalCenter = "right"
        categoryAxis.renderer.labels.template.verticalCenter = "middle"
        categoryAxis.renderer.labels.template.rotation = -45

        const valueAxis = chart.yAxes.push(new am4charts.ValueAxis())
        valueAxis.min = 0
        valueAxis.title.text = "Amount (₹ Lakh)"
        valueAxis.renderer.labels.template.adapter.add("text", (text: string) => `₹${text}L`)

        // Create series
        const series = chart.series.push(new am4charts.ColumnSeries3D())
        series.dataFields.valueY = "amount"
        series.dataFields.categoryX = "ageGroup"
        series.name = "Amount"
        series.columns.template.tooltipText = "{categoryX}\n[bold]₹{valueY} Lakh[/]"

        // Configure columns
        const columnTemplate = series.columns.template
        columnTemplate.column.cornerRadiusTopLeft = 5
        columnTemplate.column.cornerRadiusTopRight = 5
        columnTemplate.strokeWidth = 1
        columnTemplate.strokeOpacity = 0.2
        columnTemplate.stroke = am4core.color("#FFFFFF")

        // Colors
        const colors = [
          "#ef4444", // Red
          "#f97316", // Orange
          "#f59e0b", // Amber
          "#eab308"  // Yellow
        ]

        series.columns.template.adapter.add("fill", (_fill: any, target: { dataItem?: { index: number } }) => {
          if (!target.dataItem) return am4core.color(colors[0])
          return am4core.color(colors[target.dataItem.index % colors.length])
        })

        // Dark mode support
        const updateTheme = () => {
          const isDark = document.documentElement.classList.contains("dark")
          const textColor = isDark ? "#E5E7EB" : "#374151"
          
          categoryAxis.renderer.labels.template.fill = am4core.color(textColor)
          valueAxis.renderer.labels.template.fill = am4core.color(textColor)
          valueAxis.title.fill = am4core.color(textColor)
        }

        // Initial theme
        updateTheme()

        // Watch for theme changes
        observer = new MutationObserver(updateTheme)
        observer.observe(document.documentElement, {
          attributes: true,
          attributeFilter: ["class"]
        })

      } catch (error) {
        console.error("Error creating chart:", error)
      }
    }

    // Initialize
    initChart()

    // Cleanup
    return () => {
      observer?.disconnect()
      if (chart) {
        chart.dispose()
      }
    }
  }, [data])

  return (
    <div 
      ref={chartDiv}
      className="w-full h-[400px] backdrop-blur-sm bg-white/10 dark:bg-gray-900/10 border border-white/20 dark:border-gray-800/20 shadow-lg rounded-lg"
    />
  )
}

// Export with SSR disabled
export const PendingInvoicesChart = dynamic(
  () => Promise.resolve(ChartComponent),
  { 
    ssr: false,
    loading: () => (
      <div className="w-full h-[400px] backdrop-blur-sm bg-white/10 dark:bg-gray-900/10 border border-white/20 dark:border-gray-800/20 shadow-lg rounded-lg flex items-center justify-center">
        <Loader2 className="w-6 h-6 animate-spin" />
      </div>
    )
  }
)

