import { Suspense } from "react"
import { SalesDashboard } from "@/components/sales-dashboard"
import { DashboardSkeleton } from "@/components/dashboard-skeleton"
import { ThemeToggle } from "@/components/theme-toggle"

export default function DashboardPage() {
  return (
    <div className="flex min-h-screen flex-col bg-gray-50 dark:bg-gray-900">
      <header className="border-b border-gray-200 dark:border-gray-800">
        <div className="flex items-center justify-between px-6 py-3">
          <h1 className="text-xl font-semibold text-gray-900 dark:text-white">Sales Dashboard</h1>
          <ThemeToggle />
        </div>
      </header>
      <main className="flex-1">
        <Suspense fallback={<DashboardSkeleton />}>
          <SalesDashboard />
        </Suspense>
      </main>
    </div>
  )
}

