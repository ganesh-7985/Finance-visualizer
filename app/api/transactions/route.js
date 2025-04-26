import { NextResponse } from "next/server"
import clientPromise from "@/lib/mongodb"

export async function GET() {
  try {
    const client = await clientPromise
    const db = client.db("finance-visualizer")

    const transactions = await db.collection("transactions").find({}).sort({ date: -1 }).toArray()

    return NextResponse.json(transactions)
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch transactions" }, { status: 500 })
  }
}

export async function POST(request) {
  try {
    const client = await clientPromise
    const db = client.db("finance-visualizer")

    const data = await request.json()

    // Validate required fields
    if (!data.amount || !data.description || !data.date) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    // Convert amount to number
    data.amount = Number.parseFloat(data.amount)

    // Ensure date is a Date object
    data.date = new Date(data.date)

    const result = await db.collection("transactions").insertOne(data)

    return NextResponse.json(
      {
        message: "Transaction created successfully",
        id: result.insertedId,
      },
      { status: 201 },
    )
  } catch (error) {
    return NextResponse.json({ error: "Failed to create transaction" }, { status: 500 })
  }
}
