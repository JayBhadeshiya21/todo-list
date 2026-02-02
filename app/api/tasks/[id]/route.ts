import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

export async function GET(
    request: Request,
    { params }: { params: { id: string } }
) {
    try {
        const id = parseInt(params.id);
        const task = await prisma.tasks.findUnique({
            where: { TaskID: id },
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

export async function PUT(
    request: Request,
    { params }: { params: { id: string } }
) {
    try {
        const id = parseInt(params.id);
        const body = await request.json();
        const { Title, Description, Status, Priority, AssignedTo, DueDate } = body;

        const updatedTask = await prisma.tasks.update({
            where: { TaskID: id },
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
        return NextResponse.json({ error: 'Failed to update task' }, { status: 500 });
    }
}

export async function DELETE(
    request: Request,
    { params }: { params: { id: string } }
) {
    try {
        const id = parseInt(params.id);
        await prisma.tasks.delete({
            where: { TaskID: id },
        });

        return NextResponse.json({ message: 'Task deleted successfully' });
    } catch (error) {
        return NextResponse.json({ error: 'Failed to delete task' }, { status: 500 });
    }
}
