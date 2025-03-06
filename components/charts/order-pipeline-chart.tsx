"use client"

import { useEffect, useRef } from "react"
import type { SalesData } from "@/lib/types"
import { prepareOrderPipelineData } from "@/lib/chart-data"
import dynamic from "next/dynamic"
import { Loader2 } from "lucide-react"

interface OrderPipelineChartProps {
  data: SalesData[]
}

const ChartComponent = ({ data }: OrderPipelineChartProps) => {
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

        // Adjust chart padding
        chart.paddingRight = 20
        chart.paddingLeft = 20
        chart.paddingTop = 20
        chart.paddingBottom = 20

        // Set data
        const chartData = prepareOrderPipelineData(data)
        console.log('Pipeline Chart Data:', chartData)
        
        // Transform data to use count as amount
        const transformedData = chartData.map(item => ({
          stage: item.stage,
          amount: item.count
        }))
        chart.data = transformedData

        // 3D settings
        chart.angle = 30
        chart.depth = 40

        // Create axes
        const categoryAxis = chart.xAxes.push(new am4charts.CategoryAxis())
        categoryAxis.dataFields.category = "stage"
        categoryAxis.renderer.grid.template.location = 0
        categoryAxis.renderer.minGridDistance = 30
        categoryAxis.renderer.labels.template.horizontalCenter = "right"
        categoryAxis.renderer.labels.template.verticalCenter = "middle"
        categoryAxis.renderer.labels.template.rotation = -45
        categoryAxis.renderer.cellStartLocation = 0.1
        categoryAxis.renderer.cellEndLocation = 0.9
        categoryAxis.renderer.grid.template.disabled = true

        const valueAxis = chart.yAxes.push(new am4charts.ValueAxis())
        valueAxis.min = 0
        valueAxis.title.text = "Number of Orders"
        valueAxis.title.fontWeight = "bold"
        valueAxis.title.marginRight = 20
        valueAxis.renderer.grid.template.strokeDasharray = "3,3"
        valueAxis.renderer.labels.template.adapter.add("text", (text: string) => text)
        
        // Adjust value axis settings
        valueAxis.renderer.minWidth = 60
        valueAxis.renderer.labels.template.dx = -10
        valueAxis.renderer.inside = false
        valueAxis.strictMinMax = true
        valueAxis.calculateTotals = true
        valueAxis.renderer.maxLabelPosition = 0.99

        // Create series
        const series = chart.series.push(new am4charts.ColumnSeries3D())
        series.dataFields.valueY = "amount"
        series.dataFields.categoryX = "stage"
        series.name = "Orders"
        series.columns.template.tooltipText = "{categoryX}\n[bold]{valueY} Orders[/]"
        series.columns.template.width = am4core.percent(80)

        // Configure columns
        const columnTemplate = series.columns.template
        columnTemplate.column.cornerRadiusTopLeft = 5
        columnTemplate.column.cornerRadiusTopRight = 5
        columnTemplate.strokeWidth = 1
        columnTemplate.strokeOpacity = 0.2
        columnTemplate.stroke = am4core.color("#FFFFFF")

        // Colors
        const colors = [
          "#10b981", // Emerald
          "#14b8a6", // Teal
          "#06b6d4", // Cyan
          "#0ea5e9"  // Light Blue
        ]

        series.columns.template.adapter.add("fill", (_fill: any, target: { dataItem?: { index: number } }) => {
          if (!target.dataItem) return am4core.color(colors[0])
          return am4core.color(colors[target.dataItem.index % colors.length])
        })

        // Add cursor
        chart.cursor = new am4charts.XYCursor()
        chart.cursor.lineX.disabled = true
        chart.cursor.lineY.disabled = true

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
export const OrderPipelineChart = dynamic(
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

