import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { cookies } from 'next/headers';

async function checkAdmin() {
    const cookieStore = await cookies();
    const adminId = cookieStore.get('adminId');
    return !!adminId;
}

/* ================= GET ================= */
export async function GET(
    request: Request,
    context: { params: Promise<{ id: string }> }
) {
    if (!(await checkAdmin())) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    try {
        const { id } = await context.params;   // ✅ MUST await
        const userId = parseInt(id);

        if (isNaN(userId)) {
            return NextResponse.json({ error: 'Invalid ID' }, { status: 400 });
        }

        const user = await prisma.users.findUnique({
            where: { UserID: userId },
        });

        if (!user) {
            return NextResponse.json(
                { error: 'User not found' },
                { status: 404 }
            );
        }

        const { PasswordHash, ...safeUser } = user;
        return NextResponse.json(safeUser);

    } catch (error) {
        console.error(error);
        return NextResponse.json(
            { error: 'Failed to fetch user' },
            { status: 500 }
        );
    }
}

/* ================= PUT ================= */
export async function PUT(
    request: Request,
    context: { params: Promise<{ id: string }> }
) {
    if (!(await checkAdmin())) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    try {
        const { id } = await context.params;   // ✅ MUST await
        const userId = parseInt(id);

        if (isNaN(userId)) {
            return NextResponse.json({ error: 'Invalid ID' }, { status: 400 });
        }

        const body = await request.json();
        const { UserName, Email, RoleID } = body;

        const userExists = await prisma.users.findUnique({
            where: { UserID: userId }
        });

        if (!userExists) {
            return NextResponse.json({ error: 'User not found' }, { status: 404 });
        }

        const updatedUser = await prisma.users.update({
            where: { UserID: userId },
            data: { UserName, Email },
        });

        if (RoleID) {
            await prisma.userroles.deleteMany({ where: { UserID: userId } });
            await prisma.userroles.create({
                data: {
                    UserID: userId,
                    RoleID: parseInt(RoleID)
                }
            });
        }

        const { PasswordHash, ...safeUser } = updatedUser;
        return NextResponse.json(safeUser);

    } catch (error) {
        console.error(error);
        return NextResponse.json(
            { error: 'Failed to update user' },
            { status: 500 }
        );
    }
}

/* ================= DELETE ================= */
export async function DELETE(
    request: Request,
    context: { params: Promise<{ id: string }> }
) {
    if (!(await checkAdmin())) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    try {
        const { id } = await context.params;   // ✅ MUST await
        const userId = parseInt(id);

        if (isNaN(userId)) {
            return NextResponse.json({ error: 'Invalid ID' }, { status: 400 });
        }

        await prisma.users.delete({
            where: { UserID: userId },
        });

        return NextResponse.json({ message: 'User deleted successfully' });

    } catch (error) {
        console.error(error);
        return NextResponse.json(
            { error: 'Failed to delete user' },
            { status: 500 }
        );
    }
}
