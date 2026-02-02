import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

export async function GET(
    request: Request,
    { params }: { params: { id: string } }
) {
    try {
        const id = parseInt(params.id);
        const user = await prisma.users.findUnique({
            where: { UserID: id },
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
        return NextResponse.json(
            { error: 'Failed to fetch user' },
            { status: 500 }
        );
    }
}

export async function PUT(
    request: Request,
    { params }: { params: { id: string } }
) {
    try {
        const id = parseInt(params.id);
        const body = await request.json();
        const { UserName, Email, RoleID } = body;

        // Verify user exists first
        const userExists = await prisma.users.findUnique({
            where: { UserID: id }
        });

        if (!userExists) {
            return NextResponse.json({ error: 'User not found' }, { status: 404 });
        }

        const updatedUser = await prisma.users.update({
            where: { UserID: id },
            data: {
                UserName,
                Email,
                // If RoleID is provided, we might need to update userroles table.
                // For simplicity in this CRUD, assuming basic user updates.
                // Complex role management might need a separate transaction.
            },
        });

        // Update role if provided (Simplified: clear old roles, add new one)
        if (RoleID) {
            await prisma.userroles.deleteMany({ where: { UserID: id } });
            await prisma.userroles.create({
                data: {
                    UserID: id,
                    RoleID: parseInt(RoleID)
                }
            });
        }

        const { PasswordHash, ...safeUser } = updatedUser;
        return NextResponse.json(safeUser);
    } catch (error) {
        return NextResponse.json(
            { error: 'Failed to update user' },
            { status: 500 }
        );
    }
}

export async function DELETE(
    request: Request,
    { params }: { params: { id: string } }
) {
    try {
        const id = parseInt(params.id);
        await prisma.users.delete({
            where: { UserID: id },
        });

        return NextResponse.json({ message: 'User deleted successfully' });
    } catch (error) {
        return NextResponse.json(
            { error: 'Failed to delete user' },
            { status: 500 }
        );
    }
}
