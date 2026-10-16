
import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import mongoose from "mongoose";

import { connectDB } from "../../../../lib/mongodb";
import { Token } from "@/lib/token";
import Todo from "@/models/todo";

export async function GET(req: NextRequest) {
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
      typeof payload.id !== "string" ||
      !mongoose.isValidObjectId(payload.id)
    ) {
      return NextResponse.json(
        { message: "Invalid token payload" },
        { status: 401 }
      );
    }

    // Get date from query string
    const date = req.nextUrl.searchParams.get("date");
    // GET /api/todos?date=2026-10-17

    if (
      !date ||
      !/^\d{4}-\d{2}-\d{2}$/.test(date) ||
      !Number.isFinite(Date.parse(`${date}T00:00:00Z`)) ||
      new Date(`${date}T00:00:00Z`).toISOString().slice(0, 10) !== date
    ) {
      return NextResponse.json(
        { message: "Provide a valid date in YYYY-MM-DD format" },
        { status: 400 }
      );
    }

   
    const complete =req.nextUrl.searchParams.get("complete") === "true";

    // Fetch todos for this user and date
    const todos = await Todo.find({
      user: payload.id,
      date,
    }).sort({ createdAt: -1 });

    if( complete ) {

        const completedTodo = await Todo.find({
            user: payload.id,
            date,
            completed: true
        })
        
        return NextResponse.json(
          {
            message: "Todos fetched successfully",
            count: todos.length,
            completed: completedTodo.length,
            uncompleted: todos.length-completedTodo.length,
            todos: completedTodo,
          },
          { status: 200 }
        );
    }
    else {
        const uncompletedTodo = await Todo.find({
            user: payload.id,
            date,
            completed: false
        })
        
        return NextResponse.json(
          {
            message: "Todos fetched successfully",
            count: todos.length,
            completed: todos.length - uncompletedTodo.length,
            uncompleted: uncompletedTodo.length,
            todos: uncompletedTodo,
          },
          { status: 200 }
        );
    }

  } catch (error) {
    console.error("Get todos error:", error);

    return NextResponse.json(
      { message: "Server error" },
      { status: 500 }
    );
  }
}
