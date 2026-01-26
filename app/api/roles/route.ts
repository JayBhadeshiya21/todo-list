import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

export async function GET() {
    try {
        const roles = await prisma.roles.findMany();
        return NextResponse.json(roles);
    } catch (error) {
        console.error('Error fetching roles:', error);
        return NextResponse.json(
            { error: 'Failed to fetch roles' },
            { status: 500 }
        );
    }
}

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const { RoleName } = body;

        if (!RoleName) {
            return NextResponse.json(
                { error: 'RoleName is required' },
                { status: 400 }
            );
        }

        const newRole = await prisma.roles.create({
            data: { RoleName },
        });

        return NextResponse.json(newRole, { status: 201 });
    } catch (error) {
        console.error('Error creating role:', error);
        return NextResponse.json(
            { error: 'Failed to create role' },
            { status: 500 }
        );
    }
}
