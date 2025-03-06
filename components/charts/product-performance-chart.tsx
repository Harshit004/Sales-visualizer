"use client"

import { useEffect, useRef } from "react"
import * as am4core from "@amcharts/amcharts4/core"
import * as am4charts from "@amcharts/amcharts4/charts"
import am4themes_animated from "@amcharts/amcharts4/themes/animated"
import type { SalesData } from "@/lib/types"
import { prepareProductPerformanceData } from "@/lib/chart-data"

interface ProductPerformanceChartProps {
  data: SalesData[]
}

const COLORS = [
  "#4f46e5", // Indigo
  "#7c3aed", // Purple
  "#2563eb", // Blue
  "#0891b2", // Cyan
  "#059669", // Emerald
  "#16a34a", // Green
  "#ca8a04", // Yellow
  "#dc2626"  // Red
]

export function ProductPerformanceChart({ data }: ProductPerformanceChartProps) {
  const chartRef = useRef<am4charts.PieChart3D | null>(null)

  useEffect(() => {
    // Themes begin
    am4core.useTheme(am4themes_animated)
    // Themes end

    // Create chart instance
    const chart = am4core.create("pieChart3d", am4charts.PieChart3D)
    chart.hiddenState.properties.opacity = 0 // this creates initial fade-in

    // Add legend
    chart.legend = new am4charts.Legend()
    chart.legend.position = "right"
    chart.legend.scrollable = true
    chart.legend.maxHeight = 200
    chart.legend.labels.template.fontSize = 12
    chart.legend.useDefaultMarker = true
    chart.legend.markers.template.width = 12
    chart.legend.markers.template.height = 12
    chart.legend.itemContainers.template.paddingTop = 2
    chart.legend.itemContainers.template.paddingBottom = 2
    chart.legend.valueLabels.template.disabled = true

    // Set chart data
    const chartData = prepareProductPerformanceData(data)
    chart.data = chartData.map(item => ({
      name: item.name,
      value: item.value
    }))

    // Create series
    const series = chart.series.push(new am4charts.PieSeries3D())
    series.dataFields.value = "value"
    series.dataFields.category = "name"
    series.colors.list = COLORS.map(color => am4core.color(color))
    series.labels.template.disabled = true // Disable labels
    series.ticks.template.disabled = true // Disable ticks

    // Configure tooltip
    if (series.tooltip) {
      series.tooltip.getFillFromObject = false
      series.tooltip.background.fill = am4core.color("#fff")
      series.tooltip.background.stroke = am4core.color("#000")
      series.tooltip.label.fill = am4core.color("#000")
      series.tooltip.label.text = "{category}: ₹{value} Lakh"
    }

    // Dark mode support
    const root = document.documentElement
    const updateTheme = () => {
      const isDark = root.classList.contains('dark')
      const textColor = isDark ? "#E5E7EB" : "#374151"
      chart.legend.labels.template.fill = am4core.color(textColor)
      chart.legend.valueLabels.template.fill = am4core.color(textColor)
    }

    // Initial theme setup
    updateTheme()

    // Watch for theme changes
    const observer = new MutationObserver(updateTheme)
    observer.observe(root, { attributes: true, attributeFilter: ['class'] })

    // Save chart reference
    chartRef.current = chart

    // Cleanup
    return () => {
      chart.dispose()
      observer.disconnect()
    }
  }, [data])

  return (
    <div 
      id="pieChart3d" 
      className="w-full h-[400px] backdrop-blur-sm bg-white/10 dark:bg-gray-900/10 border border-white/20 dark:border-gray-800/20 shadow-lg rounded-lg"
    />
  )
} 