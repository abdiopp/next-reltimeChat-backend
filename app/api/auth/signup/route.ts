import prisma from "@/prisma";
import { connectDB } from "@/src/lib/connectDB";
import { hash } from "bcrypt";
import { NextResponse } from "next/server";

export const POST = async (req: Request) => {
  try {
    const { username, email, password } = await req.json();

    if (!username || !email || !password)
      return NextResponse.json(
        { message: "invalid credentials" },
        { status: 422 }
      );

    await connectDB();

    const existingUserByEmail = await prisma.user.findUnique({
      where: { email: email },
    });

    if (existingUserByEmail) {
      return NextResponse.json(
        { user: null, message: "User with this email already exists" },
        { status: 409 }
      );
    }

    const hashedPassword = await hash(password, 10);
    const newUser = await prisma.user.create({
      data: {
        username,
        email,
        hashedPassword,
        role: "admin",
      },
    });

    return NextResponse.json({ newUser }, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { message: "Error creating user" },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
};
