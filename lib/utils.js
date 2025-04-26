import { clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs) {
  return twMerge(clsx(inputs))
}

export function formatCurrency(amount) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(amount)
}

export function formatDate(dateString) {
  const date = new Date(dateString)
  return new Intl.DateTimeFormat("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  }).format(date)
}

export const categories = [
  { id: "food", name: "Food & Dining", color: "bg-red-500" },
  { id: "transportation", name: "Transportation", color: "bg-blue-500" },
  { id: "housing", name: "Housing", color: "bg-green-500" },
  { id: "utilities", name: "Utilities", color: "bg-yellow-500" },
  { id: "entertainment", name: "Entertainment", color: "bg-purple-500" },
  { id: "healthcare", name: "Healthcare", color: "bg-pink-500" },
  { id: "shopping", name: "Shopping", color: "bg-indigo-500" },
  { id: "personal", name: "Personal", color: "bg-orange-500" },
  { id: "education", name: "Education", color: "bg-teal-500" },
  { id: "other", name: "Other", color: "bg-gray-500" },
]

export function getCategoryById(id) {
  return categories.find((category) => category.id === id) || categories[categories.length - 1]
}

export function getMonthName(monthIndex) {
  const months = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ]
  return months[monthIndex]
}

export function getCurrentMonthYear() {
  const now = new Date()
  return {
    month: now.getMonth(),
    year: now.getFullYear(),
  }
}
