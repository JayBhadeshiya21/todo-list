import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { cookies } from 'next/headers';

async function checkAdmin() {
    const cookieStore = await cookies();
    const adminId = cookieStore.get('adminId');
    return !!adminId;
}

export async function GET(request: Request) {
    if (!await checkAdmin()) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const listId = searchParams.get('listId');
    const projectId = searchParams.get('projectId');

    try {
        let whereClause: any = {};
        if (listId) {
            whereClause.ListID = parseInt(listId);
        }
        // If filtering by project, we might need to join or assume the client knows the lists.
        // Simplifying: if project ID is passed, we might need nested relation filtering if we want all tasks for a project.
        // tasks -> tasklists -> projects
        if (projectId) {
            whereClause.tasklists = {
                ProjectID: parseInt(projectId)
            }
        }

        const tasks = await prisma.tasks.findMany({
            where: whereClause,
            include: {
                tasklists: true, // Include list info if needed
                users: { // Include assigned user info
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
    if (!await checkAdmin()) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
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

        const newTask = await prisma.tasks.create({
            data: {
                ListID: parseInt(ListID), // Ensure it's an int
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
