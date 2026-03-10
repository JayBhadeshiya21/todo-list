import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { getCurrentUser, normalizeRole } from '@/lib/auth';

export async function GET() {
    const user = await getCurrentUser();
    if (!user) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const normalizedRole = normalizeRole(user.userroles[0]?.roles?.RoleName);
    const isUserAdmin = normalizedRole === 'Admin';
    const isUserPM = normalizedRole === 'Project Manager';

    if (!isUserAdmin && !isUserPM) {
        return NextResponse.json({ error: 'Forbidden: Admin or Project Manager only' }, { status: 403 });
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
    const user = await getCurrentUser();
    if (!user) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const normalizedRole = normalizeRole(user.userroles[0]?.roles?.RoleName);
    if (normalizedRole !== 'Admin') {
        return NextResponse.json({ error: 'Unauthorized: Admin only' }, { status: 403 });
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
