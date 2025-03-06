import type { ProcessedSalesData } from "./types"

interface ForecastPoint {
  date: Date
  value: number
  isProjected: boolean
  confidenceLow?: number
  confidenceHigh?: number
}

// Simple exponential smoothing with confidence intervals
export function calculateRevenueForecast(
  historicalData: ProcessedSalesData[],
  pipelineData: ProcessedSalesData[],
  periodsToForecast: number = 3
): ForecastPoint[] {
  const alpha = 0.3 // smoothing factor
  const confidenceLevel = 0.95 // 95% confidence interval

  // Sort data by date
  const sortedData = [...historicalData].sort(
    (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
  )

  // Calculate initial forecast using simple exponential smoothing
  let lastValue = sortedData[sortedData.length - 1]?.amount || 0
  let forecast = lastValue
  let errorSum = 0
  let errorSquaredSum = 0

  // Calculate forecast errors for confidence intervals
  sortedData.forEach((point, i) => {
    if (i > 0) {
      const error = point.amount - forecast
      errorSum += error
      errorSquaredSum += error * error
      forecast = alpha * point.amount + (1 - alpha) * forecast
    }
  })

  // Calculate standard deviation of errors
  const mse = errorSquaredSum / (sortedData.length - 1)
  const stdDev = Math.sqrt(mse)

  // Generate forecast points
  const forecastPoints: ForecastPoint[] = []

  // Add historical points
  sortedData.forEach((point) => {
    forecastPoints.push({
      date: new Date(point.date),
      value: point.amount,
      isProjected: false
    })
  })

  // Add forecast points
  let currentDate = new Date(sortedData[sortedData.length - 1]?.date)
  let currentValue = forecast

  // Incorporate pipeline data into forecast
  const pipelineImpact = pipelineData.reduce((sum, deal) => {
    // Weight deals by their stage (example weights)
    const stageWeights: { [key: string]: number } = {
      'Pending': 0.2,
      'Processing': 0.4,
      'Approved': 0.6,
      'Paid': 1.0
    }
    return sum + (deal.amount * (stageWeights[deal.stage] || 0.3))
  }, 0)

  // Distribute pipeline impact across forecast periods
  const pipelinePerPeriod = pipelineImpact / periodsToForecast

  for (let i = 1; i <= periodsToForecast; i++) {
    currentDate = new Date(currentDate)
    currentDate.setMonth(currentDate.getMonth() + 1)
    
    // Adjust forecast with pipeline data
    currentValue = forecast * (1 + 0.1) + pipelinePerPeriod // 10% growth + pipeline impact
    
    // Calculate confidence intervals
    const z = 1.96 // 95% confidence level
    const interval = z * stdDev * Math.sqrt(i)
    
    forecastPoints.push({
      date: currentDate,
      value: currentValue,
      isProjected: true,
      confidenceLow: Math.max(0, currentValue - interval),
      confidenceHigh: currentValue + interval
    })
  }

  return forecastPoints
}

// Calculate expected payment realization
export function calculatePaymentRealization(
  pipelineData: ProcessedSalesData[],
  daysThreshold: number = 30
): {
  amount: number
  probability: 'high' | 'medium' | 'low'
}[] {
  const today = new Date()
  const threshold = new Date(today)
  threshold.setDate(threshold.getDate() + daysThreshold)

  return pipelineData
    .filter(deal => deal.expectedCloseDate && new Date(deal.expectedCloseDate) <= threshold)
    .map(deal => {
      // Determine probability based on stage
      let probability: 'high' | 'medium' | 'low'
      switch (deal.stage) {
        case 'Approved':
          probability = 'high'
          break
        case 'Processing':
          probability = 'medium'
          break
        default:
          probability = 'low'
      }

      return {
        amount: deal.amount,
        probability
      }
    })
} 