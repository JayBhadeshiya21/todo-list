import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { getCurrentUser, normalizeRole } from '@/lib/auth';

export async function GET(request: Request) {
    const user = await getCurrentUser();
    if (!user) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const projectId = searchParams.get('projectId');

    const normalizedRole = normalizeRole(user.userroles[0]?.roles?.RoleName);
    const isUserAdmin = normalizedRole === 'Admin';
    const isUserPM = normalizedRole === 'Project Manager';

    if (!isUserAdmin && !isUserPM) {
        return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    try {
        let whereClause: any = {};
        if (projectId) {
            whereClause.ProjectID = parseInt(projectId);
        }

        // If PM, allow them to see all tasklists to manage tasks
        if (isUserPM) {
            // (Previously restricted to whereClause.projects = { CreatedBy: user.UserID })
        }

        const lists = await prisma.tasklists.findMany({
            where: whereClause,
            include: {
                projects: true
            }
        });
        return NextResponse.json(lists);
    } catch (error) {
        console.error('Error fetching task lists:', error);
        return NextResponse.json(
            { error: 'Failed to fetch task lists' },
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

    if (!isUserAdmin && !isUserPM) {
        return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    try {
        const body = await request.json();
        const { ProjectID, ListName } = body;

        if (!ProjectID || !ListName) {
            return NextResponse.json(
                { error: 'ProjectID and ListName are required' },
                { status: 400 }
            );
        }

        // If PM, allow them to create tasklists in any project
        if (isUserPM) {
            // (Previously restricted to project ownership check)
        }

        const newList = await prisma.tasklists.create({
            data: {
                ProjectID: parseInt(ProjectID),
                ListName,
            },
        });

        return NextResponse.json(newList, { status: 201 });
    } catch (error) {
        console.error('Error creating task list:', error);
        return NextResponse.json(
            { error: 'Failed to create task list' },
            { status: 500 }
        );
    }
}
