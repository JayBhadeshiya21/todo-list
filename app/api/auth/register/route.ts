import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import bcrypt from 'bcryptjs';
import { z } from 'zod';

const registerSchema = z.object({
    username: z.string().min(3, 'Username must be at least 3 characters'),
    email: z.string().email('Invalid email address'),
    password: z.string().min(6, 'Password must be at least 6 characters'),
});

export async function POST(req: Request) {
    try {
        const body = await req.json();
        const result = registerSchema.safeParse(body);

        if (!result.success) {
            return NextResponse.json(
                { error: 'Validation failed', details: result.error },
                { status: 400 }
            );
        }

        const { username, email, password } = result.data;

        const existingUser = await prisma.users.findFirst({
            where: {
                OR: [
                    { Email: email },
                    { UserName: username },
                ],
            },
        });

        if (existingUser) {
            return NextResponse.json(
                { error: 'User with this email or username already exists' },
                { status: 409 }
            );
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const userRole = await prisma.roles.findUnique({
            where: { RoleName: 'User' },
        });

        if (!userRole) {
            return NextResponse.json(
                { error: 'Default "User" role not found in system.' },
                { status: 500 }
            );
        }

        const newUser = await prisma.users.create({
            data: {
                UserName: username,
                Email: email,
                PasswordHash: hashedPassword,
                userroles: {
                    create: {
                        RoleID: userRole.RoleID,
                    },
                },
            },
        });

        // Remove password hash from response
        const { PasswordHash, ...userWithoutPassword } = newUser;

        return NextResponse.json(
            { message: 'User registered successfully', user: userWithoutPassword },
            { status: 201 }
        );

    } catch (error) {
        console.error('Registration error:', error);
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        );
    }
}
