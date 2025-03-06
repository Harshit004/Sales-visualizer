"use client"

import { useEffect, useRef } from "react"
import type { SalesData } from "@/lib/types"
import { calculateRevenueForecast } from "@/lib/forecast-utils"
import { prepareHistoricalData, preparePipelineData } from "@/lib/chart-data"
import dynamic from "next/dynamic"
import { Loader2 } from "lucide-react"

interface RevenueForecastChartProps {
  data: SalesData[]
}

const ChartComponent = ({ data }: RevenueForecastChartProps) => {
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
        const historicalData = prepareHistoricalData(data)
        const pipelineData = preparePipelineData(data)
        
        // Calculate forecast data
        const forecastData = calculateRevenueForecast(historicalData, pipelineData)
        chart.data = forecastData

        // Create date axis
        const dateAxis = chart.xAxes.push(new am4charts.DateAxis())
        dateAxis.renderer.grid.template.location = 0
        dateAxis.renderer.minGridDistance = 15
        dateAxis.renderer.labels.template.fontSize = 12
        dateAxis.renderer.labels.template.location = 0.5
        dateAxis.renderer.labels.template.rotation = -45
        dateAxis.renderer.labels.template.horizontalCenter = "right"
        dateAxis.renderer.labels.template.verticalCenter = "middle"
        dateAxis.dateFormats.setKey("month", "MMM yyyy")
        dateAxis.periodChangeDateFormats.setKey("month", "MMM yyyy")

        // Create value axis
        const valueAxis = chart.yAxes.push(new am4charts.ValueAxis())
        valueAxis.renderer.labels.template.fontSize = 12
        valueAxis.renderer.minGridDistance = 15
        valueAxis.renderer.labels.template.adapter.add("text", (text: string) => `₹${text}L`)
        valueAxis.title.text = "Revenue (₹ Lakh)"
        valueAxis.title.fontSize = 12
        valueAxis.min = 0
        valueAxis.extraMax = 0.1

        // Create confidence interval series
        const confidenceSeries = chart.series.push(new am4charts.LineSeries())
        confidenceSeries.dataFields.dateX = "date"
        confidenceSeries.dataFields.valueY = "confidenceHigh"
        confidenceSeries.dataFields.openValueY = "confidenceLow"
        confidenceSeries.name = "Confidence Interval"
        confidenceSeries.fillOpacity = 0.2
        confidenceSeries.fill = am4core.color("#8b5cf6")
        confidenceSeries.strokeOpacity = 0
        confidenceSeries.tooltipText = "Confidence: ₹{openValueY}L - ₹{valueY}L"

        // Create historical series
        const historicalSeries = chart.series.push(new am4charts.LineSeries())
        historicalSeries.dataFields.dateX = "date"
        historicalSeries.dataFields.valueY = "value"
        historicalSeries.name = "Historical"
        historicalSeries.strokeWidth = 3
        historicalSeries.stroke = am4core.color("#4f46e5")
        historicalSeries.tooltipText = "Historical: ₹{valueY}L"
        historicalSeries.data = forecastData.filter(point => !point.isProjected)

        // Create forecast series
        const forecastSeries = chart.series.push(new am4charts.LineSeries())
        forecastSeries.dataFields.dateX = "date"
        forecastSeries.dataFields.valueY = "value"
        forecastSeries.name = "Forecast"
        forecastSeries.strokeWidth = 2
        forecastSeries.strokeDasharray = "3,3"
        forecastSeries.stroke = am4core.color("#8b5cf6")
        forecastSeries.tooltipText = "Forecast: ₹{valueY}L"
        forecastSeries.data = forecastData.filter(point => point.isProjected)

        // Add legend
        chart.legend = new am4charts.Legend()
        chart.legend.position = "top"
        chart.legend.contentAlign = "right"
        chart.legend.labels.template.fontSize = 12
        chart.legend.useDefaultMarker = true
        chart.legend.markers.template.width = 12
        chart.legend.markers.template.height = 12

        // Add cursor
        chart.cursor = new am4charts.XYCursor()
        chart.cursor.behavior = "zoomXY"
        chart.cursor.lineX.strokeOpacity = 0.2
        chart.cursor.lineY.strokeOpacity = 0.2

        // Add scrollbar
        chart.scrollbarX = new am4charts.XYChartScrollbar()
        chart.scrollbarX.series.push(historicalSeries)
        chart.scrollbarX.marginBottom = 20
        chart.scrollbarX.scrollbarChart.xAxes.getIndex(0)!.minHeight = undefined

        // Dark mode support
        const updateTheme = () => {
          const isDark = document.documentElement.classList.contains("dark")
          const textColor = isDark ? "#E5E7EB" : "#374151"
          
          dateAxis.renderer.labels.template.fill = am4core.color(textColor)
          valueAxis.renderer.labels.template.fill = am4core.color(textColor)
          valueAxis.title.fill = am4core.color(textColor)
          chart.legend.labels.template.fill = am4core.color(textColor)
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
          Revenue Forecast
        </h3>
        <div className="text-sm text-gray-500 dark:text-gray-400">
          AI-Powered Projection
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
export const RevenueForecastChart = dynamic(
  () => Promise.resolve(ChartComponent),
  { 
    ssr: false,
    loading: () => (
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
            Revenue Forecast
          </h3>
          <div className="text-sm text-gray-500 dark:text-gray-400">
            AI-Powered Projection
          </div>
        </div>
        <div className="w-full h-[400px] backdrop-blur-sm bg-white/10 dark:bg-gray-900/10 border border-white/20 dark:border-gray-800/20 shadow-lg rounded-lg flex items-center justify-center">
          <Loader2 className="w-6 h-6 animate-spin" />
        </div>
      </div>
    )
  }
) 