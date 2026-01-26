import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

export async function GET(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params;
        const taskId = parseInt(id);

        if (isNaN(taskId)) {
            return NextResponse.json({ error: 'Invalid ID' }, { status: 400 });
        }

        const task = await prisma.tasks.findUnique({
            where: { TaskID: taskId },
            include: {
                tasklists: true,
                users: {
                    select: {
                        UserID: true,
                        UserName: true,
                        Email: true
                    }
                }
            },
        });

        if (!task) {
            return NextResponse.json({ error: 'Task not found' }, { status: 404 });
        }

        return NextResponse.json(task);
    } catch (error) {
        console.error('Error fetching task:', error);
        return NextResponse.json(
            { error: 'Failed to fetch task' },
            { status: 500 }
        );
    }
}

export async function PUT(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params;
        const taskId = parseInt(id);
        const body = await request.json();

        if (isNaN(taskId)) {
            return NextResponse.json({ error: 'Invalid ID' }, { status: 400 });
        }

        const { ListID, AssignedTo, Title, Description, Priority, Status, DueDate } = body;

        const updatedTask = await prisma.tasks.update({
            where: { TaskID: taskId },
            data: {
                ListID: ListID ? parseInt(ListID) : undefined,
                AssignedTo: AssignedTo ? parseInt(AssignedTo) : undefined,
                Title,
                Description,
                Priority,
                Status,
                DueDate: DueDate ? new Date(DueDate) : undefined,
            },
        });

        return NextResponse.json(updatedTask);
    } catch (error) {
        console.error('Error updating task:', error);
        return NextResponse.json(
            { error: 'Failed to update task' },
            { status: 500 }
        );
    }
}

export async function DELETE(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params;
        const taskId = parseInt(id);

        if (isNaN(taskId)) {
            return NextResponse.json({ error: 'Invalid ID' }, { status: 400 });
        }

        await prisma.tasks.delete({
            where: { TaskID: taskId },
        });

        return NextResponse.json({ message: 'Task deleted successfully' });
    } catch (error) {
        console.error('Error deleting task:', error);
        return NextResponse.json(
            { error: 'Failed to delete task' },
            { status: 500 }
        );
    }
}
