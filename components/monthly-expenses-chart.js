"use client"

import { useState, useEffect } from "react"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts"
import { getMonthName } from "@/lib/utils"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Label } from "@/components/ui/label"

export default function MonthlyExpensesChart({ transactions }) {
  const [chartData, setChartData] = useState([])
  const [year, setYear] = useState(new Date().getFullYear())
  const availableYears = [...new Set(transactions.map((t) => new Date(t.date).getFullYear()))].sort()

  useEffect(() => {
    prepareChartData()
  }, [transactions, year])

  const prepareChartData = () => {
    // Initialize data for all months
    const monthlyData = Array(12)
      .fill()
      .map((_, i) => ({
        month: getMonthName(i),
        amount: 0,
        monthIndex: i,
      }))

    // Sum transactions by month for the selected year
    transactions.forEach((transaction) => {
      const date = new Date(transaction.date)
      if (date.getFullYear() === year) {
        const monthIndex = date.getMonth()
        monthlyData[monthIndex].amount += transaction.amount
      }
    })

    setChartData(monthlyData)
  }

  if (transactions.length === 0) {
    return <div className="flex items-center justify-center h-full">No data available</div>
  }

  return (
    <div className="h-full">
      <div className="mb-4 flex items-center gap-2">
        <Label htmlFor="year-select">Year:</Label>
        <Select value={year.toString()} onValueChange={(value) => setYear(Number.parseInt(value))}>
          <SelectTrigger id="year-select" className="w-[100px]">
            <SelectValue placeholder="Select year" />
          </SelectTrigger>
          <SelectContent>
            {availableYears.length > 0 ? (
              availableYears.map((year) => (
                <SelectItem key={year} value={year.toString()}>
                  {year}
                </SelectItem>
              ))
            ) : (
              <SelectItem value={year.toString()}>{year}</SelectItem>
            )}
          </SelectContent>
        </Select>
      </div>

      <ResponsiveContainer width="100%" height="90%">
        <BarChart data={chartData}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="month" tickFormatter={(value, index) => value.substring(0, 3)} />
          <YAxis />
          <Tooltip formatter={(value) => [`$${value.toFixed(2)}`, "Expenses"]} labelFormatter={(label) => `${label}`} />
          <Bar dataKey="amount" fill="#8884d8" name="Expenses" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  )
}
