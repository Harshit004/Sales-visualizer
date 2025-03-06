"use client"

import { useEffect, useRef } from "react"
import type { SalesData } from "@/lib/types"
import { calculatePaymentRealization } from "@/lib/forecast-utils"
import { preparePipelineData } from "@/lib/chart-data"
import dynamic from "next/dynamic"
import { Loader2 } from "lucide-react"

interface PaymentRealizationChartProps {
  data: SalesData[]
}

const ChartComponent = ({ data }: PaymentRealizationChartProps) => {
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
        chart = am4core.create(chartDiv.current as HTMLDivElement, am4charts.XYChart)
        
        // Prepare data
        const pipelineData = preparePipelineData(data)
        const realizationData = calculatePaymentRealization(pipelineData)
        
        // Transform data for stacked columns
        const chartData = [
          {
            probability: "High",
            amount: realizationData.filter(item => item.probability === 'high').reduce((sum, item) => sum + item.amount, 0),
            color: "#10b981" // Emerald
          },
          {
            probability: "Medium",
            amount: realizationData.filter(item => item.probability === 'medium').reduce((sum, item) => sum + item.amount, 0),
            color: "#f59e0b" // Amber
          },
          {
            probability: "Low",
            amount: realizationData.filter(item => item.probability === 'low').reduce((sum, item) => sum + item.amount, 0),
            color: "#ef4444" // Red
          }
        ]
        
        chart.data = chartData

        // Create category axis
        const categoryAxis = chart.xAxes.push(new am4charts.CategoryAxis())
        categoryAxis.dataFields.category = "probability"
        categoryAxis.renderer.grid.template.location = 0
        categoryAxis.renderer.minGridDistance = 15
        categoryAxis.renderer.labels.template.fontSize = 12
        categoryAxis.renderer.labels.template.horizontalCenter = "middle"
        categoryAxis.renderer.cellStartLocation = 0.1
        categoryAxis.renderer.cellEndLocation = 0.9
        categoryAxis.title.text = "Payment Probability"
        categoryAxis.title.fontSize = 12
        categoryAxis.title.marginTop = 10

        // Create value axis
        const valueAxis = chart.yAxes.push(new am4charts.ValueAxis())
        valueAxis.renderer.labels.template.fontSize = 12
        valueAxis.renderer.minGridDistance = 15
        valueAxis.title.text = "Amount (₹ Lakh)"
        valueAxis.title.fontSize = 12
        valueAxis.min = 0
        valueAxis.extraMax = 0.1
        valueAxis.renderer.labels.template.adapter.add("text", (text: string) => `₹${text}L`)

        // Create series
        const series = chart.series.push(new am4charts.ColumnSeries())
        series.dataFields.valueY = "amount"
        series.dataFields.categoryX = "probability"
        series.name = "Expected Payments"
        series.columns.template.tooltipText = "{categoryX}\n[bold]₹{valueY}L[/]"
        series.columns.template.fillOpacity = 0.9

        // Configure columns
        const columnTemplate = series.columns.template
        columnTemplate.column.cornerRadiusTopLeft = 5
        columnTemplate.column.cornerRadiusTopRight = 5
        columnTemplate.strokeWidth = 1
        columnTemplate.strokeOpacity = 0.2
        columnTemplate.stroke = am4core.color("#FFFFFF")

        // Add legend
        chart.legend = new am4charts.Legend()
        chart.legend.position = "top"
        chart.legend.contentAlign = "right"
        chart.legend.labels.template.fontSize = 12
        chart.legend.useDefaultMarker = true
        chart.legend.markers.template.width = 12
        chart.legend.markers.template.height = 12

        // Set column colors
        series.columns.template.adapter.add("fill", (_fill: any, target: { dataItem?: { dataContext: { color: string } } }) => {
          if (!target.dataItem) return am4core.color("#10b981")
          return am4core.color(target.dataItem.dataContext.color)
        })

        // Add cursor
        chart.cursor = new am4charts.XYCursor()
        chart.cursor.lineX.strokeOpacity = 0.2
        chart.cursor.lineY.strokeOpacity = 0.2

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
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
          Expected Payment Realization
        </h3>
        <div className="text-sm text-gray-500 dark:text-gray-400">
          Next 30 Days
        </div>
      </div>
      <div 
        ref={chartDiv}
        className="w-full h-[400px] backdrop-blur-sm bg-white/10 dark:bg-gray-900/10 border border-white/20 dark:border-gray-800/20 shadow-lg rounded-lg"
      />
    </div>
  )
}

// Export with SSR disabled
export const PaymentRealizationChart = dynamic(
  () => Promise.resolve(ChartComponent),
  { 
    ssr: false,
    loading: () => (
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
            Expected Payment Realization
          </h3>
          <div className="text-sm text-gray-500 dark:text-gray-400">
            Next 30 Days
          </div>
        </div>
        <div className="w-full h-[400px] backdrop-blur-sm bg-white/10 dark:bg-gray-900/10 border border-white/20 dark:border-gray-800/20 shadow-lg rounded-lg flex items-center justify-center">
          <Loader2 className="w-6 h-6 animate-spin" />
        </div>
      </div>
    )
  }
) 