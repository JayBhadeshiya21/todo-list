import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { cookies } from 'next/headers';

async function checkAdmin() {
    const cookieStore = await cookies();
    const adminId = cookieStore.get('adminId');
    return !!adminId;
}

export async function GET() {
    if (!await checkAdmin()) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    try {
        const users = await prisma.users.findMany({
            select: {
                UserID: true,
                UserName: true,
                Email: true,
                CreatedAt: true,
                userroles: {
                    select: {
                        roles: {
                            select: {
                                RoleName: true
                            }
                        }
                    }
                }
            },
            orderBy: { CreatedAt: 'desc' }
        });

        // Clean & flatten roles
        const safeUsers = users.map(user => ({
            UserID: user.UserID,
            UserName: user.UserName,
            Email: user.Email,
            CreatedAt: user.CreatedAt,
            Roles: user.userroles.map(
                ur => ur.roles.RoleName
            )
        }));

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
    if (!await checkAdmin()) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    try {
        const body = await request.json();
        const { UserName, Email, PasswordHash, RoleID } = body;

        if (!UserName || !Email || !PasswordHash) {
            return NextResponse.json(
                { error: 'Missing required fields' },
                { status: 400 }
            );
        }

        const existingUser = await prisma.users.findFirst({
            where: {
                OR: [
                    { Email },
                    { UserName }
                ]
            }
        });

        if (existingUser) {
            return NextResponse.json(
                { error: 'User with this email or username already exists' },
                { status: 409 }
            );
        }

        const newUser = await prisma.users.create({
            data: {
                UserName,
                Email,
                PasswordHash, // hash in real apps
            },
        });

        if (RoleID) {
            await prisma.userroles.create({
                data: {
                    UserID: newUser.UserID,
                    RoleID: parseInt(RoleID)
                }
            });
        }

        // Never return password
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
