import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { cookies } from 'next/headers';

async function checkAdmin() {
    const cookieStore = await cookies();
    const adminId = cookieStore.get('adminId');
    return !!adminId;
}

export async function GET(
    request: Request,
    { params }: { params: { id: string } }
) {
    if (!await checkAdmin()) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    try {
        const id = parseInt(params.id);
        const role = await prisma.roles.findUnique({
            where: { RoleID: id },
        });

        if (!role) {
            return NextResponse.json({ error: 'Role not found' }, { status: 404 });
        }

        return NextResponse.json(role);
    } catch (error) {
        return NextResponse.json({ error: 'Failed to fetch role' }, { status: 500 });
    }
}

export async function PUT(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    if (!(await checkAdmin())) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    try {
        const { id } = await params;   // ✅ MUST await
        const roleId = parseInt(id);

        if (isNaN(roleId)) {
            return NextResponse.json({ error: "Invalid ID" }, { status: 400 });
        }

        const body = await request.json();
        const { RoleName } = body;

        const updatedRole = await prisma.roles.update({ // singular!
            where: { RoleID: roleId },
            data: { RoleName },
        });

        return NextResponse.json(updatedRole);
    } catch (error) {
        console.error(error);
        return NextResponse.json({ error: "Failed to update role" }, { status: 500 });
    }
}


export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;   // ✅ MUST await

  if (!(await checkAdmin())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const roleId = parseInt(id);

    if (isNaN(roleId)) {
      return NextResponse.json({ error: "Invalid ID" }, { status: 400 });
    }

    await prisma.roles.delete({
      where: { RoleID: roleId },
    });

    return NextResponse.json({ message: "Role deleted successfully" });
  } catch (error) {
    return NextResponse.json({ error: "Failed to delete role" }, { status: 500 });
  }
}
