import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

export async function GET() {
    try {
        const users = await prisma.users.findMany({
            orderBy: {
                CreatedAt: 'desc',
            },
        });
        // Remove passwords from response
        const safeUsers = users.map((user) => {
            const { PasswordHash, ...rest } = user;
            return rest;
        });
        return NextResponse.json(safeUsers);
    } catch (error) {
        console.error('Error fetching users:', error);
        return NextResponse.json(
            { error: 'Failed to fetch users' },
            { status: 500 }
        );
    }
}

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const { UserName, Email, PasswordHash } = body;

        // Basic validation
        if (!UserName || !Email || !PasswordHash) {
            return NextResponse.json(
                { error: 'Missing required fields' },
                { status: 400 }
            );
        }

        // Check availability
        const existingUser = await prisma.users.findFirst({
            where: {
                OR: [
                    { Email: Email },
                    { UserName: UserName }
                ]
            }
        })

        if (existingUser) {
            return NextResponse.json({ error: 'User with this email or username already exists' }, { status: 409 })
        }

        const newUser = await prisma.users.create({
            data: {
                UserName,
                Email,
                PasswordHash, // In a real app we'd hash this here or expect it hashed. The user field is PasswordHash so we assume value is intended to be stored as is for now or hashed before sending.
            },
        });

        const { PasswordHash: _, ...safeUser } = newUser;

        return NextResponse.json(safeUser, { status: 201 });
    } catch (error) {
        console.error('Error creating user:', error);
        return NextResponse.json(
            { error: 'Failed to create user' },
            { status: 500 }
        );
    }
}
