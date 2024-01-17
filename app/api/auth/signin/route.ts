import { connectDB } from "@/src/lib/connectDB";
import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import prisma from "@/prisma";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { email, password } = body;

    await connectDB();

    // Check if email already exists
    const existingUserByEmail: any = await prisma.user.findUnique({
      where: { email: email },
    });

    if (!existingUserByEmail) {
      return NextResponse.json(
        { user: null, message: "Invalid Credentials" },
        { status: 401 }
      );
    }

    // Compare the hashed password
    const isMatch = await bcrypt.compare(
      password,
      existingUserByEmail.hashedPassword
    );

    if (!isMatch) {
      return NextResponse.json(
        { message: "Password doesn't match" },
        { status: 401 }
      );
    }

    const key: any = process.env.JWT_SECRET;

    // Sign JWT token
    const token = jwt.sign({ email: email }, key, {
      expiresIn: "30d",
    });

    const user = {
      id: existingUserByEmail.id,
      email: existingUserByEmail.email,
      username: existingUserByEmail.username,
      profilePic: existingUserByEmail.profilePic,
    };

    return NextResponse.json(
      {
        success: true,
        message: "login successfully",
        user,
        token,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error:", error);
    return NextResponse.json(
      { message: "Error while signing in" },
      { status: 500 }
    );
  }
}
