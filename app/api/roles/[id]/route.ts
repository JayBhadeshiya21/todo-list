import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

export async function GET(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params;
        const roleId = parseInt(id);

        if (isNaN(roleId)) {
            return NextResponse.json({ error: 'Invalid ID' }, { status: 400 });
        }

        const role = await prisma.roles.findUnique({
            where: { RoleID: roleId },
        });

        if (!role) {
            return NextResponse.json({ error: 'Role not found' }, { status: 404 });
        }

        return NextResponse.json(role);
    } catch (error) {
        console.error('Error fetching role:', error);
        return NextResponse.json(
            { error: 'Failed to fetch role' },
            { status: 500 }
        );
    }
}

export async function PUT(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params;
        const roleId = parseInt(id);
        const body = await request.json();

        if (isNaN(roleId)) {
            return NextResponse.json({ error: 'Invalid ID' }, { status: 400 });
        }

        const { RoleName } = body;

        const updatedRole = await prisma.roles.update({
            where: { RoleID: roleId },
            data: { RoleName },
        });

        return NextResponse.json(updatedRole);
    } catch (error) {
        console.error('Error updating role:', error);
        return NextResponse.json(
            { error: 'Failed to update role' },
            { status: 500 }
        );
    }
}

export async function DELETE(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params;
        const roleId = parseInt(id);

        if (isNaN(roleId)) {
            return NextResponse.json({ error: 'Invalid ID' }, { status: 400 });
        }

        await prisma.roles.delete({
            where: { RoleID: roleId },
        });

        return NextResponse.json({ message: 'Role deleted successfully' });
    } catch (error) {
        console.error('Error deleting role:', error);
        return NextResponse.json(
            { error: 'Failed to delete role' },
            { status: 500 }
        );
    }
}
