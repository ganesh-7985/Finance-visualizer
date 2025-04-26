import { NextResponse } from "next/server"
import clientPromise from "@/lib/mongodb"

export async function GET() {
  try {
    const client = await clientPromise
    const db = client.db("finance-visualizer")

    const budgets = await db.collection("budgets").find({}).toArray()

    return NextResponse.json(budgets)
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch budgets" }, { status: 500 })
  }
}

export async function POST(request) {
  try {
    const client = await clientPromise
    const db = client.db("finance-visualizer")

    const data = await request.json()

    // Validate required fields
    if (!data.categoryId || !data.amount || !data.month || !data.year) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    // Convert amount to number
    data.amount = Number.parseFloat(data.amount)

    // Check if budget already exists for this category and month/year
    const existingBudget = await db.collection("budgets").findOne({
      categoryId: data.categoryId,
      month: data.month,
      year: data.year,
    })

    if (existingBudget) {
      // Update existing budget
      await db.collection("budgets").updateOne({ _id: existingBudget._id }, { $set: { amount: data.amount } })

      return NextResponse.json({
        message: "Budget updated successfully",
        id: existingBudget._id,
      })
    } else {
      // Create new budget
      const result = await db.collection("budgets").insertOne(data)

      return NextResponse.json(
        {
          message: "Budget created successfully",
          id: result.insertedId,
        },
        { status: 201 },
      )
    }
  } catch (error) {
    return NextResponse.json({ error: "Failed to create/update budget" }, { status: 500 })
  }
}
