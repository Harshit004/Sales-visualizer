"use client"

import { useEffect, useState } from "react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import type { SalesData } from "@/lib/types"
import { prepareCustomerRetentionData } from "@/lib/chart-data"
import { formatCurrency, formatPercentage } from "@/lib/utils"
import { motion } from "framer-motion"

interface CustomerRetentionTableProps {
  data: SalesData[]
}

export function CustomerRetentionTable({ data }: CustomerRetentionTableProps) {
  const [tableData, setTableData] = useState<any[]>([])

  useEffect(() => {
    setTableData(prepareCustomerRetentionData(data))
  }, [data])

  return (
    <div className="max-h-[300px] overflow-auto">
      <Table>
        <TableHeader>
          <TableRow className="bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm">
            <TableHead className="font-semibold text-gray-900 dark:text-gray-100">Customer Category</TableHead>
            <TableHead className="font-semibold text-gray-900 dark:text-gray-100">Orders</TableHead>
            <TableHead className="font-semibold text-gray-900 dark:text-gray-100">Revenue (₹ Lakh)</TableHead>
            <TableHead className="font-semibold text-gray-900 dark:text-gray-100">Retention Rate</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {tableData.map((row, index) => (
            <motion.tr
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="group relative overflow-hidden backdrop-blur-sm border-white/50 dark:border-gray-700/50 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-[1.02] hover:-translate-y-1 after:absolute after:inset-0 after:opacity-0 after:transition-opacity after:duration-500 hover:after:opacity-100 after:rounded-lg after:bg-gradient-to-r after:from-transparent after:via-blue-500/20 dark:after:via-blue-400/20 after:to-transparent after:blur-xl after:pointer-events-none"
            >
              <TableCell className="font-medium text-gray-900 dark:text-gray-100 relative z-10 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors duration-300">
                {row.category}
              </TableCell>
              <TableCell className="text-gray-700 dark:text-gray-300 relative z-10 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors duration-300">
                {row.orders}
              </TableCell>
              <TableCell className="text-gray-700 dark:text-gray-300 relative z-10 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors duration-300">
                ₹{formatCurrency(row.revenue)}
              </TableCell>
              <TableCell className="relative z-10">
                <div className="flex items-center gap-2">
                  <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2.5 overflow-hidden">
                    <div
                      className="bg-blue-600 dark:bg-blue-500 h-2.5 rounded-full transition-all duration-500 group-hover:shadow-[0_0_8px_rgba(59,130,246,0.5)] group-hover:bg-blue-500 dark:group-hover:bg-blue-400"
                      style={{ width: `${row.retentionRate}%` }}
                    />
                  </div>
                  <span className="text-gray-700 dark:text-gray-300 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors duration-300">
                    {formatPercentage(row.retentionRate)}%
                  </span>
                </div>
              </TableCell>
            </motion.tr>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}

