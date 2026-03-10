import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { getCurrentUser, normalizeRole } from '@/lib/auth';

/* ===================== GET ===================== */
export async function GET(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    const user = await getCurrentUser();
    if (!user) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    try {
        const { id } = await params;
        const taskId = parseInt(id);

        if (isNaN(taskId)) {
            return NextResponse.json({ error: 'Invalid ID' }, { status: 400 });
        }

        const task = await prisma.tasks.findUnique({
            where: { TaskID: taskId },
            include: {
                users: { select: { UserName: true, UserID: true } },
                tasklists: {
                    include: {
                        projects: true
                    }
                }
            }
        });

        if (!task) {
            return NextResponse.json({ error: 'Task not found' }, { status: 404 });
        }

        const normalizedRole = normalizeRole(user.userroles[0]?.roles?.RoleName);
        const isUserAdmin = normalizedRole === 'Admin';
        const isUserPM = normalizedRole === 'Project Manager';
        const isUserTM = normalizedRole === 'Team Member';

        // Access check
        if (isUserPM && task.tasklists.projects.CreatedBy !== user.UserID) {
            return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
        }

        if (isUserTM && task.AssignedTo !== user.UserID) {
            return NextResponse.json({ error: 'Forbidden: This task is not assigned to you' }, { status: 403 });
        }

        return NextResponse.json(task);

    } catch (error) {
        return NextResponse.json({ error: 'Failed to fetch task' }, { status: 500 });
    }
}

/* ===================== PUT ===================== */
export async function PUT(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    const user = await getCurrentUser();
    if (!user) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    try {
        const { id } = await params;
        const taskId = parseInt(id);

        if (isNaN(taskId)) {
            return NextResponse.json({ error: 'Invalid ID' }, { status: 400 });
        }

        const task = await prisma.tasks.findUnique({
            where: { TaskID: taskId },
            include: {
                tasklists: {
                    include: { projects: true }
                }
            }
        });

        if (!task) {
            return NextResponse.json({ error: 'Task not found' }, { status: 404 });
        }

        const normalizedRole = normalizeRole(user.userroles[0]?.roles?.RoleName);
        const isUserAdmin = normalizedRole === 'Admin';
        const isUserPM = normalizedRole === 'Project Manager';
        const isUserTM = normalizedRole === 'Team Member';

        const body = await request.json();
        const { Title, Description, Status, Priority, AssignedTo, DueDate, ListID } = body;

        // PM logic
        if (isUserPM && task.tasklists.projects.CreatedBy !== user.UserID) {
            return NextResponse.json({ error: 'Forbidden: You do not own this project' }, { status: 403 });
        }

        // TM logic: Can only update their OWN task, and maybe only status/list (movement)
        if (isUserTM) {
            if (task.AssignedTo !== user.UserID) {
                return NextResponse.json({ error: 'Forbidden: You can only update your assigned tasks' }, { status: 403 });
            }
            // TM can only update Status or ListID (movement)
            // But for simplicity, we'll allow fields if they own the task, just ignore sensitive ones if needed.
            // Requirement says "Edit task - ✅ (own task only)", "Move tasks - ✅ (own task only)", "Update status - ✅ (own task)".
        }

        // Final Forbidden check for non-Admin/non-PM who doesn't own the task
        if (!isUserAdmin && !isUserPM && (isUserTM && task.AssignedTo !== user.UserID)) {
            return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
        }

        const updatedTask = await prisma.tasks.update({
            where: { TaskID: taskId },
            data: {
                Title: (isUserAdmin || isUserPM) ? Title : task.Title, // TM cannot change title
                Description: (isUserAdmin || isUserPM) ? Description : task.Description,
                Status,
                Priority: (isUserAdmin || isUserPM) ? Priority : task.Priority,
                AssignedTo: (isUserAdmin || isUserPM) ? (AssignedTo ? parseInt(AssignedTo) : null) : task.AssignedTo,
                DueDate: (isUserAdmin || isUserPM) ? (DueDate ? new Date(DueDate) : null) : task.DueDate,
                ListID: ListID ? parseInt(ListID) : task.ListID
            },
        });

        return NextResponse.json(updatedTask);

    } catch (error) {
        console.error(error);
        return NextResponse.json({ error: 'Failed to update task' }, { status: 500 });
    }
}

/* ===================== DELETE ===================== */
export async function DELETE(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    const user = await getCurrentUser();
    if (!user) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    try {
        const { id } = await params;
        const taskId = parseInt(id);

        const task = await prisma.tasks.findUnique({
            where: { TaskID: taskId },
            include: {
                tasklists: {
                    include: { projects: true }
                }
            }
        });

        if (!task) {
            return NextResponse.json({ error: 'Task not found' }, { status: 404 });
        }

        const normalizedRole = normalizeRole(user.userroles[0]?.roles?.RoleName);
        const isUserAdmin = normalizedRole === 'Admin';
        const isUserPM = normalizedRole === 'Project Manager';

        if (!isUserAdmin && !(isUserPM && task.tasklists.projects.CreatedBy === user.UserID)) {
            return NextResponse.json({ error: 'Forbidden: Only Admin or Project Creator can delete tasks' }, { status: 403 });
        }

        await prisma.tasks.delete({
            where: { TaskID: taskId },
        });

        return NextResponse.json({ message: 'Task deleted successfully' });

    } catch (error) {
        console.error(error);
        return NextResponse.json({ error: 'Failed to delete task' }, { status: 500 });
    }
}
