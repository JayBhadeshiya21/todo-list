import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { cookies } from 'next/headers';

async function checkAdmin() {
    const cookieStore = await cookies();
    const adminId = cookieStore.get('adminId');
    return !!adminId;
}

/* ===================== GET ===================== */
export async function GET(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    if (!(await checkAdmin())) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    try {
        const { id } = await params;   // ✅ MUST await
        const taskId = parseInt(id);

        if (isNaN(taskId)) {
            return NextResponse.json({ error: 'Invalid ID' }, { status: 400 });
        }

        const task = await prisma.tasks.findUnique({
            where: { TaskID: taskId },
            include: {
                users: { select: { UserName: true } },
                tasklists: { select: { ListName: true } }
            }
        });

        if (!task) {
            return NextResponse.json({ error: 'Task not found' }, { status: 404 });
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
    if (!(await checkAdmin())) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    try {
        const { id } = await params;   // ✅ MUST await
        const taskId = parseInt(id);

        if (isNaN(taskId)) {
            return NextResponse.json({ error: 'Invalid ID' }, { status: 400 });
        }

        const body = await request.json();
        const { Title, Description, Status, Priority, AssignedTo, DueDate } = body;

        const updatedTask = await prisma.tasks.update({
            where: { TaskID: taskId },
            data: {
                Title,
                Description,
                Status,
                Priority,
                AssignedTo: AssignedTo ? parseInt(AssignedTo) : null,
                DueDate: DueDate ? new Date(DueDate) : null
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
    if (!(await checkAdmin())) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    try {
        const { id } = await params;   // ✅ MUST await
        const taskId = parseInt(id);

        if (isNaN(taskId)) {
            return NextResponse.json({ error: 'Invalid ID' }, { status: 400 });
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
