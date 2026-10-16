
import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import mongoose from "mongoose";

import { connectDB } from "../../../../../lib/mongodb";
import { Token } from "@/lib/token";
import Todo from "@/models/todo";

type RouteContext = {
  params: Promise<{ id: string }>;
};

export async function PATCH(
  req: NextRequest,
  { params }: RouteContext
) {
  try {
    await connectDB();

    // Get token from cookie
    const cookieStore = await cookies();
    const token = cookieStore.get("token")?.value;

    if (!token) {
      return NextResponse.json(
        { message: "Please log in first" },
        { status: 401 }
      );
    }

    // Verify token
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

    // Get todo ID from URL
    const { id } = await params;

    if (!mongoose.isValidObjectId(id)) {
      return NextResponse.json(
        { message: "Invalid todo ID" },
        { status: 400 }
      );
    }

    // Read completion status
    const body = await req.json();

    if (typeof body.completed !== "boolean") {
      return NextResponse.json(
        { message: "completed must be a boolean" },
        { status: 400 }
      );
    }

    // Update only this user's todo
    const todo = await Todo.findOneAndUpdate(
      {
        _id: id,
        user: payload.id,
      },
      {
        $set: { completed: body.completed },
      },
      {
        new: true,
        runValidators: true,
      }
    );

    if (!todo) {
      return NextResponse.json(
        { message: "Todo not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(
      {
        message: body.completed
          ? "Todo completed successfully"
          : "Todo marked as incomplete",
        todo,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Complete todo error:", error);

    return NextResponse.json(
      { message: "Server error" },
      { status: 500 }
    );
  }
}
