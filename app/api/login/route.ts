import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export async function POST(req: Request) {
  try {
    const { email, password } = await req.json();

    const user = await prisma.users.findFirst({
      where: {
        Email: email,
        PasswordHash: password,
      },
      include: {
        userroles: {
          include: { roles: true },
        },
      },
    });

    console.log("USER:", user);

    if (!user) {
      return NextResponse.json(
        { error: "Invalid credentials" },
        { status: 401 },
      );
    }

   

    const isAdmin = user.userroles.some(
      (ur) => ur.roles && ur.roles.RoleName.toUpperCase() === "ADMIN",
    );

    if (!isAdmin) {
      return NextResponse.json(
        { error: "Access denied: Admin only" },
        { status: 403 },
      );
    }

    const res = NextResponse.json({ message: "Login successful" });
    res.cookies.set("adminId", user.UserID.toString(), {
      httpOnly: true,
      path: "/",
    });

    return res;
  } catch (err) {
    
    return NextResponse.json({ error: "Login failed" }, { status: 500 });
  }
}
