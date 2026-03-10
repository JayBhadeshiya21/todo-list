import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { getCurrentUser, normalizeRole } from '@/lib/auth';

export async function GET(request: Request) {
    const user = await getCurrentUser();
    if (!user) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const listId = searchParams.get('listId');
    const projectId = searchParams.get('projectId');

    const normalizedRole = normalizeRole(user.userroles[0]?.roles?.RoleName);
    const isUserAdmin = normalizedRole === 'Admin';
    const isUserPM = normalizedRole === 'Project Manager';
    const isUserTM = normalizedRole === 'Team Member';

    try {
        let whereClause: any = {};

        if (listId) {
            whereClause.ListID = parseInt(listId);
        }

        if (projectId) {
            whereClause.tasklists = {
                ProjectID: parseInt(projectId)
            };
        }

        // Access Control
        if (isUserPM) {
            // PM can only see tasks from their own projects
            whereClause.tasklists = {
                ...(whereClause.tasklists || {}),
                projects: {
                    CreatedBy: user.UserID
                }
            };
        } else if (isUserTM) {
            // TM can only see tasks assigned to them
            whereClause.AssignedTo = user.UserID;
        }

        const tasks = await prisma.tasks.findMany({
            where: whereClause,
            include: {
                tasklists: {
                    include: {
                        projects: true
                    }
                },
                users: { // Assigned user info
                    select: {
                        UserName: true,
                        Email: true,
                        UserID: true
                    }
                }
            },
            orderBy: {
                CreatedAt: 'desc',
            },
        });
        return NextResponse.json(tasks);
    } catch (error) {
        console.error('Error fetching tasks:', error);
        return NextResponse.json(
            { error: 'Failed to fetch tasks' },
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

    // Only Admin and PM can create tasks
    if (!isUserAdmin && !isUserPM) {
        return NextResponse.json({ error: 'Forbidden: Task creation restricted to Admin and Project Managers' }, { status: 403 });
    }

    try {
        const body = await request.json();
        const { ListID, AssignedTo, Title, Description, Priority, Status, DueDate } = body;

        if (!ListID || !Title) {
            return NextResponse.json(
                { error: 'ListID and Title are required' },
                { status: 400 }
            );
        }

        // If PM, allow them to create tasks in any list
        if (isUserPM) {
            // (Previously restricted to project ownership check)
        }

        // Final Title requirement check (Title is already checked in ListID check above)
        if (!Title) {
            return NextResponse.json({ error: 'Title is required' }, { status: 400 });
        }

        const newTask = await prisma.tasks.create({
            data: {
                ListID: parseInt(ListID),
                AssignedTo: AssignedTo ? parseInt(AssignedTo) : null,
                Title,
                Description,
                Priority,
                Status,
                DueDate: DueDate ? new Date(DueDate) : null
            },
        });

        return NextResponse.json(newTask, { status: 201 });
    } catch (error) {
        console.error('Error creating task:', error);
        return NextResponse.json(
            { error: 'Failed to create task' },
            { status: 500 }
        );
    }
}
