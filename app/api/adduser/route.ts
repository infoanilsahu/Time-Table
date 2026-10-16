
import { NextRequest, NextResponse } from "next/server";
import User from "../../../models/user";
import { password as Pass } from "../../../lib/password";
import { connectDB } from "@/lib/mongodb";

export async function POST(req: NextRequest) {
  try {
    
    await connectDB()

    const { username, password, goal } = await req.json();

    // Validate input
    if (
      typeof username !== "string" ||
      !username.trim() ||
      typeof password !== "string" ||
      password.length === 0
    ) {
      return NextResponse.json(
        { message: "Username and password are required" },
        { status: 400 }
      );
    }

    // Check if username already exists
    const existsUser = await User.findOne({
      username: username.trim(),
    });

    if (existsUser) {
      return NextResponse.json(
        { message: "Username already exists" },
        { status: 409 }
      );
    }

    // Hash password
    const hashedPassword = await Pass.hash(password);

    // Create user
    const newUser = await User.create({
      username: username.toLocaleLowerCase().trim(),
      password: hashedPassword,
      goal: typeof goal === "string" && goal.trim()
        ? goal.trim()
        : undefined,
    });

    return NextResponse.json(
      {
        message: "User registered successfully",
        id: newUser._id.toString(),
      },
      { status: 201 }
    );
  } catch (error) {
    // Handle duplicate username if concurrent requests occur
    if (
      typeof error === "object" &&
      error !== null &&
      "code" in error &&
      error.code === 11000
    ) {
      return NextResponse.json(
        { message: "Username already exists" },
        { status: 409 }
      );
    }

    console.error("Registration error:", error);

    return NextResponse.json(
      { message: "Server error" },
      { status: 500 }
    );
  }
}
