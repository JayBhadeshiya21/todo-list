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



    const { normalizeRole } = await import("@/lib/auth");
    const userRole = user.userroles[0]?.roles?.RoleName || "";
    const normalizedRole = normalizeRole(userRole);

    const isAdmin = normalizedRole === "Admin";

    if (!normalizedRole) {
      return NextResponse.json(
        { error: "Access denied: No role assigned" },
        { status: 403 },
      );
    }

    const res = NextResponse.json({
      message: "Login successful",
      user: {
        UserID: user.UserID,
        UserName: user.UserName,
        Role: normalizedRole
      }
    });

    res.cookies.set("userId", user.UserID.toString(), {
      httpOnly: true,
      path: "/",
    });
    res.cookies.set("userRole", normalizedRole, {
      httpOnly: true,
      path: "/",
    });

    // Maintain backward compatibility for adminId if needed
    if (isAdmin) {
      res.cookies.set("adminId", user.UserID.toString(), {
        httpOnly: true,
        path: "/",
      });
    }

    return res;
  } catch (err) {

    return NextResponse.json({ error: "Login failed" }, { status: 500 });
  }
}
