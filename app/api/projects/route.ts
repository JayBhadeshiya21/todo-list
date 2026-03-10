import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { getCurrentUser, normalizeRole } from '@/lib/auth';

export async function GET(request: Request) {
    const user = await getCurrentUser();
    if (!user) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const normalizedRole = normalizeRole(user.userroles[0]?.roles?.RoleName);
    const isUserAdmin = normalizedRole === 'Admin';
    const isUserPM = normalizedRole === 'Project Manager';
    const isUserTM = normalizedRole === 'Team Member';

    const { searchParams } = new URL(request.url);
    const requestedUserId = searchParams.get('userId');

    try {
        let whereClause: any = {};

        if (isUserPM) {
            // PM can see all projects to manage tasks
            // (Previously restricted to whereClause.CreatedBy = user.UserID)
        } else if (isUserTM) {
            // TM can see projects where they have assigned tasks
            whereClause.tasklists = {
                some: {
                    tasks: {
                        some: {
                            AssignedTo: user.UserID
                        }
                    }
                }
            };
        } else if (isUserAdmin && requestedUserId) {
            // Admin can filter by userId if provided
            whereClause.CreatedBy = parseInt(requestedUserId);
        }

        const projects = await prisma.projects.findMany({
            where: whereClause,
            include: {
                users: { // Creator info
                    select: {
                        UserName: true,
                        Email: true
                    }
                }
            },
            orderBy: {
                CreatedAt: 'desc',
            },
        });
        return NextResponse.json(projects);
    } catch (error) {
        console.error('Error fetching projects:', error);
        return NextResponse.json(
            { error: 'Failed to fetch projects' },
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
    const isUserAdmin = normalizedRole === 'Admin';
    const isUserPM = normalizedRole === 'Project Manager';

    // Only Admin and PM can create projects
    if (!isUserAdmin && !isUserPM) {
        return NextResponse.json({ error: 'Forbidden: Creation restricted to Admin and Project Managers' }, { status: 403 });
    }

    try {
        const body = await request.json();
        const { ProjectName, Description, CreatedBy } = body;

        if (!ProjectName) {
            return NextResponse.json(
                { error: 'ProjectName is required' },
                { status: 400 }
            );
        }

        const newProject = await prisma.projects.create({
            data: {
                ProjectName,
                Description,
                CreatedBy: isUserAdmin ? (CreatedBy ? parseInt(CreatedBy) : user.UserID) : user.UserID,
            },
        });

        return NextResponse.json(newProject, { status: 201 });
    } catch (error) {
        console.error('Error creating project:', error);
        return NextResponse.json(
            { error: 'Failed to create project' },
            { status: 500 }
        );
    }
}
