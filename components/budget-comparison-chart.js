"use client"

import { useState, useEffect } from "react"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts"
import { getCategoryById, getMonthName, getCurrentMonthYear } from "@/lib/utils"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Label } from "@/components/ui/label"

export default function BudgetComparisonChart({ transactions, budgets }) {
  const [chartData, setChartData] = useState([])
  const { month: currentMonth, year: currentYear } = getCurrentMonthYear()
  const [selectedMonth, setSelectedMonth] = useState(currentMonth)
  const [selectedYear, setSelectedYear] = useState(currentYear)

  useEffect(() => {
    prepareChartData()
  }, [transactions, budgets, selectedMonth, selectedYear])

  const prepareChartData = () => {
    // Get all categories that have budgets for the selected month/year
    const budgetCategories = budgets
      .filter((budget) => budget.month === selectedMonth && budget.year === selectedYear)
      .map((budget) => budget.categoryId)

    // Get all categories that have transactions for the selected month/year
    const transactionCategories = transactions
      .filter((transaction) => {
        const date = new Date(transaction.date)
        return date.getMonth() === selectedMonth && date.getFullYear() === selectedYear
      })
      .map((transaction) => transaction.categoryId)

    // Combine unique categories
    const uniqueCategories = [...new Set([...budgetCategories, ...transactionCategories])]

    // Prepare chart data
    const data = uniqueCategories.map((categoryId) => {
      const category = getCategoryById(categoryId)

      // Find budget for this category
      const budget = budgets.find(
        (b) => b.categoryId === categoryId && b.month === selectedMonth && b.year === selectedYear,
      )

      // Calculate actual spending for this category
      const actual = transactions
        .filter((transaction) => {
          const date = new Date(transaction.date)
          return (
            transaction.categoryId === categoryId &&
            date.getMonth() === selectedMonth &&
            date.getFullYear() === selectedYear
          )
        })
        .reduce((sum, transaction) => sum + transaction.amount, 0)

      return {
        name: category.name,
        budget: budget ? budget.amount : 0,
        actual: actual,
      }
    })

    setChartData(data)
  }

  if (transactions.length === 0 && budgets.length === 0) {
    return <div className="flex items-center justify-center h-full">No data available</div>
  }

  return (
    <div className="h-full">
      <div className="mb-4 flex flex-wrap items-center gap-2">
        <Label htmlFor="month-select">Month:</Label>
        <Select value={selectedMonth.toString()} onValueChange={(value) => setSelectedMonth(Number.parseInt(value))}>
          <SelectTrigger id="month-select" className="w-[120px]">
            <SelectValue placeholder="Select month" />
          </SelectTrigger>
          <SelectContent>
            {Array(12)
              .fill()
              .map((_, i) => (
                <SelectItem key={i} value={i.toString()}>
                  {getMonthName(i)}
                </SelectItem>
              ))}
          </SelectContent>
        </Select>

        <Label htmlFor="year-select" className="ml-4">
          Year:
        </Label>
        <Select value={selectedYear.toString()} onValueChange={(value) => setSelectedYear(Number.parseInt(value))}>
          <SelectTrigger id="year-select" className="w-[100px]">
            <SelectValue placeholder="Select year" />
          </SelectTrigger>
          <SelectContent>
            {[currentYear - 1, currentYear, currentYear + 1].map((year) => (
              <SelectItem key={year} value={year.toString()}>
                {year}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {chartData.length === 0 ? (
        <div className="flex items-center justify-center h-[80%]">
          No budget or spending data for the selected period
        </div>
      ) : (
        <ResponsiveContainer width="100%" height="80%">
          <BarChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip formatter={(value) => [`$${value.toFixed(2)}`, ""]} />
            <Legend />
            <Bar dataKey="budget" fill="#8884d8" name="Budget" />
            <Bar dataKey="actual" fill="#82ca9d" name="Actual" />
          </BarChart>
        </ResponsiveContainer>
      )}
    </div>
  )
}
