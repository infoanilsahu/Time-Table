
import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { connectDB } from "../../../../lib/mongodb";
import { Token } from "@/lib/token";
import Todo from "@/models/todo";
import User from "@/models/user";
import mongoose from "mongoose";

export async function POST(req: NextRequest) {
  try {
    await connectDB();

    // Get JWT from cookie
    const cookieStore = await cookies();
    const token = cookieStore.get("token")?.value;

    if (!token) {
      return NextResponse.json(
        { message: "Please log in first" },
        { status: 401 }
      );
    }

    // Verify JWT
    let payload;

    try {
      payload = Token.verify(token);
    } catch {
      return NextResponse.json(
        { message: "Invalid or expired token" },
        { status: 401 }
      );
    }

    if (
      typeof payload === "string" ||
      !payload.id ||
      typeof payload.id !== "string" ||
      !mongoose.isValidObjectId(payload.id)
    ) {
      return NextResponse.json(
        { message: "Invalid token payload" },
        { status: 401 }
      );
    }

    // Confirm the user still exists
    const user = await User.findById(payload.id).select("_id");

    if (!user) {
      return NextResponse.json(
        { message: "User not found" },
        { status: 401 }
      );
    }

    // Read and validate request body
    const body = await req.json();
    const { title, priority, date } = body;

    if (typeof title !== "string" || !title.trim()) {
      return NextResponse.json(
        { message: "Todo title is required" },
        { status: 400 }
      );
    }

    const allowedPriorities = ["high", "medium", "low", "normal"];

    if (
      priority !== undefined &&
      !allowedPriorities.includes(priority)
    ) {
      return NextResponse.json(
        { message: "Invalid priority" },
        { status: 400 }
      );
    }

    if (
      date !== undefined &&
      (typeof date !== "string" ||
        !/^\d{4}-\d{2}-\d{2}$/.test(date) ||
        !Number.isFinite(Date.parse(`${date}T00:00:00Z`)) ||
        new Date(`${date}T00:00:00Z`).toISOString().slice(0, 10) !== date)
    ) {
      return NextResponse.json(
        { message: "Date must be a valid YYYY-MM-DD date" },
        { status: 400 }
      );
    }

    // Save todo for the authenticated user
    const todo = await Todo.create({
      title: title.trim(),
      priority: priority ?? "normal",
      ...(date !== undefined ? { date } : {}),
      user: user._id,
    });

    return NextResponse.json(
      {
        message: "Todo added successfully",
        todo,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Add todo error:", error);

    return NextResponse.json(
      { message: "Server error" },
      { status: 500 }
    );
  }
}
