"use client"

import { useState, useEffect } from "react"
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from "recharts"
import { getCategoryById } from "@/lib/utils"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Label } from "@/components/ui/label"

export default function CategoryPieChart({ transactions }) {
  const [chartData, setChartData] = useState([])
  const [period, setPeriod] = useState("all")

  useEffect(() => {
    prepareChartData()
  }, [transactions, period])

  const prepareChartData = () => {
    // Filter transactions based on selected period
    let filteredTransactions = [...transactions]

    if (period !== "all") {
      const now = new Date()
      const currentMonth = now.getMonth()
      const currentYear = now.getFullYear()

      filteredTransactions = transactions.filter((transaction) => {
        const transactionDate = new Date(transaction.date)

        if (period === "month") {
          return transactionDate.getMonth() === currentMonth && transactionDate.getFullYear() === currentYear
        } else if (period === "year") {
          return transactionDate.getFullYear() === currentYear
        }

        return true
      })
    }

    // Group by category
    const categoryTotals = {}

    filteredTransactions.forEach((transaction) => {
      const categoryId = transaction.categoryId || "other"
      if (!categoryTotals[categoryId]) {
        categoryTotals[categoryId] = 0
      }
      categoryTotals[categoryId] += transaction.amount
    })

    // Convert to chart data format
    const data = Object.keys(categoryTotals).map((categoryId) => {
      const category = getCategoryById(categoryId)
      return {
        name: category.name,
        value: categoryTotals[categoryId],
        color: category.color.replace("bg-", ""),
      }
    })

    setChartData(data)
  }

  const getColorFromTailwind = (colorClass) => {
    const colorMap = {
      "red-500": "#ef4444",
      "blue-500": "#3b82f6",
      "green-500": "#22c55e",
      "yellow-500": "#eab308",
      "purple-500": "#a855f7",
      "pink-500": "#ec4899",
      "indigo-500": "#6366f1",
      "orange-500": "#f97316",
      "teal-500": "#14b8a6",
      "gray-500": "#6b7280",
    }

    return colorMap[colorClass] || "#6b7280"
  }

  if (transactions.length === 0) {
    return <div className="flex items-center justify-center h-full">No data available</div>
  }

  return (
    <div className="h-full">
      <div className="mb-4 flex items-center gap-2">
        <Label htmlFor="period-select">Period:</Label>
        <Select value={period} onValueChange={setPeriod}>
          <SelectTrigger id="period-select" className="w-[150px]">
            <SelectValue placeholder="Select period" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Time</SelectItem>
            <SelectItem value="year">This Year</SelectItem>
            <SelectItem value="month">This Month</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {chartData.length === 0 ? (
        <div className="flex items-center justify-center h-[80%]">No categories found for the selected period</div>
      ) : (
        <ResponsiveContainer width="100%" height="80%">
          <PieChart>
            <Pie data={chartData} cx="50%" cy="50%" labelLine={false} outerRadius={80} fill="#8884d8" dataKey="value">
              {chartData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={getColorFromTailwind(entry.color)} />
              ))}
            </Pie>
            <Tooltip formatter={(value) => [`$${value.toFixed(2)}`, "Amount"]} />
            <Legend />
          </PieChart>
        </ResponsiveContainer>
      )}
    </div>
  )
}
