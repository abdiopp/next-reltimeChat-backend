import prisma from "@/prisma";
import { NextResponse } from "next/server";

export const GET = async (req: Request) => {
  const url = new URL(req.url);
  const id = url.searchParams.get("id");

  if (!id) {
    return NextResponse.json({ error: "Invalid user ID" }, { status: 400 });
  }

  try {
    const user = await prisma.user.findUnique({
      where: {
        id: id,
      },
    });

    return NextResponse.json({ profilePic: user?.profilePic }, { status: 200 });
  } catch (error) {
    console.log("error", error);
  }
};
