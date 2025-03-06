import type { SalesData, KpiData } from "./types"

export function calculateKpis(data: SalesData[], timeframe: string): KpiData {
  // Handle empty data case
  if (!data || data.length === 0) {
    return {
      totalRevenue: 0,
      revenueGrowth: 0,
      grossMargin: 0,
      marginGrowth: 0,
      avgOrderValue: 0,
      aovGrowth: 0,
      pendingOrders: 0,
      pendingOrdersPercentage: 0,
    }
  }

  // Filter data based on timeframe
  const filteredData = filterDataByTimeframe(data, timeframe)
  const previousData = filterDataByPreviousTimeframe(data, timeframe)

  // Calculate total revenue
  const totalRevenue = filteredData.reduce((sum, item) => sum + (item["Total Revenue (₹ Lakh)"] || 0), 0)
  const previousRevenue = previousData.reduce((sum, item) => sum + (item["Total Revenue (₹ Lakh)"] || 0), 0)
  const revenueGrowth = previousRevenue ? ((totalRevenue - previousRevenue) / previousRevenue) * 100 : 0

  // Calculate gross margin
  const totalProfit = filteredData.reduce((sum, item) => sum + (item["Profit (₹ Lakh)"] || 0), 0)
  const grossMargin = totalRevenue ? (totalProfit / totalRevenue) * 100 : 0

  const previousProfit = previousData.reduce((sum, item) => sum + (item["Profit (₹ Lakh)"] || 0), 0)
  const previousMargin = previousRevenue ? (previousProfit / previousRevenue) * 100 : 0
  const marginGrowth = previousMargin ? ((grossMargin - previousMargin) / previousMargin) * 100 : 0

  // Calculate average order value
  const uniqueOrders = new Set(filteredData.map((item) => item["Sales Document No."]))
  const avgOrderValue = uniqueOrders.size ? totalRevenue / uniqueOrders.size : 0

  const previousUniqueOrders = new Set(previousData.map((item) => item["Sales Document No."]))
  const previousAOV = previousUniqueOrders.size ? previousRevenue / previousUniqueOrders.size : 0
  const aovGrowth = previousAOV ? ((avgOrderValue - previousAOV) / previousAOV) * 100 : 0

  // Calculate pending orders
  const pendingOrders = filteredData.filter(
    (item) => item["Delivery Status"] === "Pending" || item["Delivery Status"] === "Processing",
  ).length

  const pendingOrdersPercentage = filteredData.length ? (pendingOrders / filteredData.length) * 100 : 0

  return {
    totalRevenue,
    revenueGrowth,
    grossMargin,
    marginGrowth,
    avgOrderValue,
    aovGrowth,
    pendingOrders,
    pendingOrdersPercentage,
  }
}

function filterDataByTimeframe(data: SalesData[], timeframe: string): SalesData[] {
  const now = new Date()
  let startDate: Date

  switch (timeframe) {
    case "mtd":
      startDate = new Date(now.getFullYear(), now.getMonth(), 1)
      break
    case "qtd":
      const quarter = Math.floor(now.getMonth() / 3)
      startDate = new Date(now.getFullYear(), quarter * 3, 1)
      break
    case "ytd":
      startDate = new Date(now.getFullYear(), 0, 1)
      break
    default:
      startDate = new Date(now.getFullYear(), now.getMonth(), 1)
  }

  return data.filter((item) => {
    const orderDate = new Date(item["Sales Order Date"])
    return orderDate >= startDate && orderDate <= now
  })
}

function filterDataByPreviousTimeframe(data: SalesData[], timeframe: string): SalesData[] {
  const now = new Date()
  let startDate: Date
  let endDate: Date

  switch (timeframe) {
    case "mtd":
      endDate = new Date(now.getFullYear(), now.getMonth(), 0)
      startDate = new Date(endDate.getFullYear(), endDate.getMonth(), 1)
      break
    case "qtd":
      const quarter = Math.floor(now.getMonth() / 3)
      endDate = new Date(now.getFullYear(), quarter * 3, 0)
      startDate = new Date(
        quarter === 0 ? now.getFullYear() - 1 : now.getFullYear(),
        quarter === 0 ? 9 : (quarter - 1) * 3,
        1,
      )
      break
    case "ytd":
      endDate = new Date(now.getFullYear() - 1, 11, 31)
      startDate = new Date(now.getFullYear() - 1, 0, 1)
      break
    default:
      endDate = new Date(now.getFullYear(), now.getMonth(), 0)
      startDate = new Date(endDate.getFullYear(), endDate.getMonth(), 1)
  }

  return data.filter((item) => {
    const orderDate = new Date(item["Sales Order Date"])
    return orderDate >= startDate && orderDate <= endDate
  })
}

