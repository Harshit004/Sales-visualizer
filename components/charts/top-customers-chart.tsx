"use client"

import { useEffect, useRef, useState } from "react"
import type { SalesData } from "@/lib/types"
import { prepareTopCustomersData } from "@/lib/chart-data"

interface TopCustomersChartProps {
  data: SalesData[]
}

export function TopCustomersChart({ data }: TopCustomersChartProps) {
  const chartRef = useRef<any>(null)
  const chartDiv = useRef<HTMLDivElement>(null)
  const [chartInitialized, setChartInitialized] = useState(false)

  useEffect(() => {
    if (typeof window === 'undefined' || !chartDiv.current) return

    const initChart = async () => {
      try {
        // Dynamic imports
        const modules = await Promise.all([
          import("@amcharts/amcharts4/core"),
          import("@amcharts/amcharts4/charts"),
          import("@amcharts/amcharts4/themes/animated")
        ])

        const am4core = modules[0]
        const am4charts = modules[1]
        const am4themes_animated = modules[2].default

        // Enable animation theme
        am4core.useTheme(am4themes_animated)

        // Create chart instance
        if (!chartDiv.current) return
        const chart = am4core.create(chartDiv.current, am4charts.XYChart3D)
        chart.paddingRight = 20

        // Add data
        const chartData = prepareTopCustomersData(data)
        chart.data = chartData

        // 3D properties
        chart.angle = 30
        chart.depth = 40

        // Create axes
        const categoryAxis = chart.yAxes.push(new am4charts.CategoryAxis())
        categoryAxis.dataFields.category = "customer"
        categoryAxis.renderer.grid.template.location = 0
        categoryAxis.renderer.minGridDistance = 30
        categoryAxis.renderer.labels.template.fill = am4core.color("#374151")
        categoryAxis.renderer.labels.template.fontSize = 12
        categoryAxis.renderer.inversed = true // Invert axis to show highest value at top

        const valueAxis = chart.yAxes.push(new am4charts.ValueAxis())
        valueAxis.renderer.labels.template.fontSize = 12
        valueAxis.renderer.minGridDistance = 20
        valueAxis.renderer.labels.template.dx = -10
        valueAxis.renderer.labels.template.maxWidth = 150
        valueAxis.renderer.labels.template.truncate = false
        valueAxis.title.text = "Revenue (₹ Lakh)"
        valueAxis.title.fontSize = 12
        valueAxis.min = 0
        valueAxis.renderer.labels.template.adapter.add("text", (value: string | undefined) => value ? `₹${value}L` : "")

        // Create series
        const series = chart.series.push(new am4charts.ColumnSeries3D())
        series.dataFields.valueX = "revenue"
        series.dataFields.categoryY = "customer"
        series.name = "Revenue"
        series.columns.template.propertyFields.fill = "color"
        series.columns.template.column3D.stroke = am4core.color("#ffffff")
        series.columns.template.column3D.strokeOpacity = 0.2

        // Configure columns
        const columnTemplate = series.columns.template
        columnTemplate.column.cornerRadiusTopLeft = 5
        columnTemplate.column.cornerRadiusTopRight = 5
        columnTemplate.fillOpacity = 0.9
        columnTemplate.strokeWidth = 1
        columnTemplate.strokeOpacity = 0.3
        columnTemplate.stroke = am4core.color("#ffffff")

        // Add colors
        series.columns.template.adapter.add("fill", (fill, target) => {
          if (!target.dataItem) return am4core.color(COLUMN_COLORS[0])
          return am4core.color(getColumnColor(target.dataItem.index ?? 0))
        })

        // Configure tooltips
        series.tooltipText = "{categoryY}\n[bold]₹{valueX} Lakh[/]"
        
        if (series.tooltip) {
          series.tooltip.getFillFromObject = false
          series.tooltip.background.fill = am4core.color("#fff")
          series.tooltip.label.fill = am4core.color("#000")
          series.tooltip.background.cornerRadius = 8
          series.tooltip.background.strokeWidth = 0
          series.tooltip.label.padding(12, 16, 12, 16)
          series.tooltip.background.filters.clear()
        }

        // Cursor
        chart.cursor = new am4charts.XYCursor()
        chart.cursor.lineX.disabled = true
        chart.cursor.lineY.disabled = true

        // Dark mode support
        const root = document.documentElement
        const updateTheme = () => {
          const isDark = root.classList.contains('dark')
          const textColor = isDark ? "#E5E7EB" : "#374151"
          
          categoryAxis.renderer.labels.template.fill = am4core.color(textColor)
          valueAxis.renderer.labels.template.fill = am4core.color(textColor)
          valueAxis.title.fill = am4core.color(textColor)
          
          if (series.tooltip) {
            series.tooltip.background.fill = am4core.color(isDark ? "#1F2937" : "#ffffff")
            series.tooltip.label.fill = am4core.color(isDark ? "#E5E7EB" : "#374151")
          }
        }

        // Initial theme setup
        updateTheme()

        // Watch for theme changes
        const observer = new MutationObserver(updateTheme)
        observer.observe(root, { attributes: true, attributeFilter: ['class'] })

        // Save chart reference
        chartRef.current = chart
        setChartInitialized(true)

        return () => {
          chart.dispose()
          observer.disconnect()
        }
      } catch (error) {
        console.error('Error initializing chart:', error)
      }
    }

    initChart()
  }, [data])

  return (
    <div 
      ref={chartDiv}
      className="w-full h-[400px] backdrop-blur-sm bg-white/10 dark:bg-gray-900/10 border border-white/20 dark:border-gray-800/20 shadow-lg rounded-lg"
      suppressHydrationWarning
    />
  )
}

const COLUMN_COLORS = [
  "#4f46e5", // Indigo
  "#10b981", // Emerald
  "#f97316", // Orange
  "#6366f1", // Blue
  "#8b5cf6", // Purple
  "#ec4899", // Pink
  "#14b8a6", // Teal
  "#f59e0b", // Amber
]

function getColumnColor(index: number): string {
  return COLUMN_COLORS[index % COLUMN_COLORS.length]
}

