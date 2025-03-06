export interface SalesData {
  "Sales Document No.": number
  "Sales Order Date": string
  "Customer Name": string
  "Customer Code": string
  "Customer Category": string
  "Sales Organization": string
  "Billing Document": number
  "Billing Date": string
  "Invoice Due Date": string
  "Product Code": string
  "Product Name": string
  "Quantity Sold": number
  "Unit Price (₹)": number
  "Total Revenue (₹ Lakh)": number
  "Cost Price per Unit (₹)": number
  "Total Cost (₹ Lakh)": number
  "Profit (₹ Lakh)": number
  "Gross Margin %": number
  "Discount (%)": number
  "Final Invoice Value (₹ Lakh)": number
  "Payment Status": string
  "Payment Terms": string
  "Order Priority": string
  "Sales Rep Name": string
  Region: string
  "Delivery Status": string
}

export interface ChartData {
  name: string
  value: number
}

export interface ProcessedSalesData {
  id: string
  date: string
  amount: number
  customer: string
  product: string
  region: string
  salesRep: string
  stage: string
  expectedCloseDate?: string
}

export interface KpiData {
  totalRevenue: number
  revenueGrowth: number
  grossMargin: number
  marginGrowth: number
  avgOrderValue: number
  aovGrowth: number
  pendingOrders: number
  pendingOrdersPercentage: number
}

