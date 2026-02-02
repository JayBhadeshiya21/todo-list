import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

export async function GET(
    request: Request,
    { params }: { params: { id: string } }
) {
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
    { params }: { params: { id: string } }
) {
    try {
        const id = parseInt(params.id);
        const body = await request.json();
        const { RoleName } = body;

        const updatedRole = await prisma.roles.update({
            where: { RoleID: id },
            data: { RoleName },
        });

        return NextResponse.json(updatedRole);
    } catch (error) {
        return NextResponse.json({ error: 'Failed to update role' }, { status: 500 });
    }
}

export async function DELETE(
    request: Request,
    { params }: { params: { id: string } }
) {
    try {
        const id = parseInt(params.id);
        await prisma.roles.delete({
            where: { RoleID: id },
        });

        return NextResponse.json({ message: 'Role deleted successfully' });
    } catch (error) {
        return NextResponse.json({ error: 'Failed to delete role' }, { status: 500 });
    }
}
