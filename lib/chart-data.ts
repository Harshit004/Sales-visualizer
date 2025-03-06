import type { SalesData, ChartData, ProcessedSalesData } from "./types"

export function prepareRevenueChartData(data: SalesData[], timeframe: string): any[] {
  if (!data || data.length === 0) {
    return [
      { date: "1/2025", revenue: 0 },
      { date: "2/2025", revenue: 0 },
      { date: "3/2025", revenue: 0 },
    ]
  }

  // Group data by month
  const groupedData = data.reduce(
    (acc, item) => {
      const date = new Date(item["Sales Order Date"])
      const monthYear = `${date.getMonth() + 1}/${date.getFullYear()}`

      if (!acc[monthYear]) {
        acc[monthYear] = 0
      }

      acc[monthYear] += item["Total Revenue (₹ Lakh)"] || 0

      return acc
    },
    {} as Record<string, number>,
  )

  // Convert to array format for chart
  return Object.entries(groupedData)
    .map(([date, revenue]) => ({
      date,
      revenue: Number.parseFloat(revenue.toFixed(2)),
    }))
    .sort((a, b) => {
      const [aMonth, aYear] = a.date.split("/").map(Number)
      const [bMonth, bYear] = b.date.split("/").map(Number)

      if (aYear !== bYear) return aYear - bYear
      return aMonth - bMonth
    })
}

export function prepareRegionSalesData(data: SalesData[]): any[] {
  if (!data || data.length === 0) {
    return [
      { region: "North", revenue: 0 },
      { region: "South", revenue: 0 },
      { region: "East", revenue: 0 },
      { region: "West", revenue: 0 },
    ]
  }

  // Group data by region
  const groupedData = data.reduce(
    (acc, item) => {
      const region = item["Region"] || "Unknown"

      if (!acc[region]) {
        acc[region] = 0
      }

      acc[region] += item["Total Revenue (₹ Lakh)"] || 0

      return acc
    },
    {} as Record<string, number>,
  )

  // Convert to array format for chart
  return Object.entries(groupedData)
    .map(([region, revenue]) => ({
      region,
      revenue: Number.parseFloat(revenue.toFixed(2)),
    }))
    .sort((a, b) => b.revenue - a.revenue)
}

export function prepareTopCustomersData(data: SalesData[]): any[] {
  if (!data || data.length === 0) {
    return []
  }
  // Group data by customer
  const groupedData = data.reduce(
    (acc, item) => {
      const customer = item["Customer Name"]

      if (!acc[customer]) {
        acc[customer] = 0
      }

      acc[customer] += item["Total Revenue (₹ Lakh)"] || 0

      return acc
    },
    {} as Record<string, number>,
  )

  // Convert to array format for chart and take top 10
  return Object.entries(groupedData)
    .map(([customer, revenue]) => ({
      customer,
      revenue: Number.parseFloat(revenue.toFixed(2)),
    }))
    .sort((a, b) => b.revenue - a.revenue)
    .slice(0, 10)
}

export function prepareProductPerformanceData(data: SalesData[]): any[] {
  if (!data || data.length === 0) {
    return []
  }
  // Group data by product
  const groupedData = data.reduce(
    (acc, item) => {
      const product = item["Product Name"]

      if (!acc[product]) {
        acc[product] = 0
      }

      acc[product] += item["Total Revenue (₹ Lakh)"] || 0

      return acc
    },
    {} as Record<string, number>,
  )

  // Convert to array format for chart
  return Object.entries(groupedData)
    .map(([name, value]) => ({
      name,
      value: Number.parseFloat(value.toFixed(2)),
    }))
    .sort((a, b) => b.value - a.value)
    .slice(0, 8) // Limit to top 8 for better visualization
}

export function prepareSalesRepData(data: SalesData[]): any[] {
  if (!data || data.length === 0) {
    return []
  }
  // Group data by sales rep
  const groupedData = data.reduce(
    (acc, item) => {
      const name = item["Sales Rep Name"]

      if (!acc[name]) {
        acc[name] = 0
      }

      acc[name] += item["Total Revenue (₹ Lakh)"] || 0

      return acc
    },
    {} as Record<string, number>,
  )

  // Convert to array format for chart
  return Object.entries(groupedData)
    .map(([name, revenue]) => ({
      name,
      revenue: Number.parseFloat(revenue.toFixed(2)),
    }))
    .sort((a, b) => b.revenue - a.revenue)
    .slice(0, 10) // Limit to top 10
}

export function preparePendingInvoicesData(data: SalesData[]): any[] {
  if (!data || data.length === 0) {
    return []
  }
  // Filter unpaid invoices
  const unpaidInvoices = data.filter((item) => item["Payment Status"] === "Unpaid")

  // Group by age buckets
  const today = new Date()
  const agingBuckets = {
    "0-30 days": 0,
    "31-60 days": 0,
    "61-90 days": 0,
    "90+ days": 0,
  }

  unpaidInvoices.forEach((item) => {
    const dueDate = new Date(item["Invoice Due Date"])
    const daysDiff = Math.floor((today.getTime() - dueDate.getTime()) / (1000 * 60 * 60 * 24))

    let bucket
    if (daysDiff <= 30) bucket = "0-30 days"
    else if (daysDiff <= 60) bucket = "31-60 days"
    else if (daysDiff <= 90) bucket = "61-90 days"
    else bucket = "90+ days"

    agingBuckets[bucket] += item["Final Invoice Value (₹ Lakh)"] || 0
  })

  // Convert to array format for chart
  return Object.entries(agingBuckets).map(([ageGroup, amount]) => ({
    ageGroup,
    amount: Number.parseFloat(amount.toFixed(2)),
  }))
}

export function prepareOrderPipelineData(data: SalesData[]): any[] {
  if (!data || data.length === 0) {
    return []
  }
  // Count orders by delivery status
  const statusCounts = data.reduce(
    (acc, item) => {
      const status = item["Delivery Status"]

      if (!acc[status]) {
        acc[status] = 0
      }

      acc[status]++

      return acc
    },
    {} as Record<string, number>,
  )

  // Convert to array format for chart
  return Object.entries(statusCounts).map(([stage, count]) => ({
    stage,
    count,
  }))
}

export function prepareCustomerRetentionData(data: SalesData[]): any[] {
  if (!data || data.length === 0) {
    return []
  }
  // Group by customer category
  const categories = [...new Set(data.map((item) => item["Customer Category"]))]

  return categories.map((category) => {
    const categoryData = data.filter((item) => item["Customer Category"] === category)

    // Count unique customers
    const uniqueCustomers = new Set(categoryData.map((item) => item["Customer Code"]))

    // Count customers with multiple orders
    const customerOrderCounts = categoryData.reduce(
      (acc, item) => {
        const customer = item["Customer Code"]
        if (!acc[customer]) acc[customer] = 0
        acc[customer]++
        return acc
      },
      {} as Record<string, number>,
    )

    const repeatCustomers = Object.values(customerOrderCounts).filter((count) => count > 1).length

    // Calculate retention rate
    const retentionRate = uniqueCustomers.size > 0 ? (repeatCustomers / uniqueCustomers.size) * 100 : 0

    // Calculate total revenue for this category
    const revenue = categoryData.reduce((sum, item) => sum + (item["Total Revenue (₹ Lakh)"] || 0), 0)

    return {
      category,
      customers: uniqueCustomers.size,
      orders: categoryData.length,
      revenue: Number.parseFloat(revenue.toFixed(2)),
      retentionRate: Number.parseFloat(retentionRate.toFixed(2)),
    }
  })
}

export function prepareHistoricalData(data: SalesData[]): ProcessedSalesData[] {
  return data.map(item => ({
    id: item["Sales Document No."].toString(),
    date: item["Sales Order Date"],
    amount: item["Final Invoice Value (₹ Lakh)"],
    customer: item["Customer Name"],
    product: item["Product Name"],
    region: item.Region,
    salesRep: item["Sales Rep Name"],
    stage: item["Payment Status"]
  }))
}

export function preparePipelineData(data: SalesData[]): ProcessedSalesData[] {
  return data
    .filter(item => item["Payment Status"] !== "Paid")
    .map(item => ({
      id: item["Sales Document No."].toString(),
      date: item["Sales Order Date"],
      amount: item["Final Invoice Value (₹ Lakh)"],
      customer: item["Customer Name"],
      product: item["Product Name"],
      region: item.Region,
      salesRep: item["Sales Rep Name"],
      stage: item["Payment Status"],
      expectedCloseDate: item["Invoice Due Date"]
    }))
}

