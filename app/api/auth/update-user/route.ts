import prisma from "@/prisma";
import { NextResponse } from "next/server";

export async function PUT(req: Request) {
  try {
    const body = await req.json();
    const { username, email, oldemail, profilePic } = body;

    // return NextResponse.json({ id, isChecked });

    if (profilePic && email) {
      await prisma.user.update({
        where: { email: email },
        data: {
          profilePic: profilePic,
        },
      });
      return NextResponse.json(
        { message: "Profile Pic Updated", profilePic: profilePic },
        { status: 201 }
      );
    }

    await prisma.user.update({
      where: { email: oldemail },
      data: {
        username: username,
        email: email,
      },
    });

    return NextResponse.json({ message: "Profile Updated" }, { status: 201 });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { message: "Profile Could Not Be Updated" },
      { status: 500 }
    );
  }
}
