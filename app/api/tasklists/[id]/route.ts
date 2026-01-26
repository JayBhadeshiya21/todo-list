import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

export async function GET(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params;
        const listId = parseInt(id);

        if (isNaN(listId)) {
            return NextResponse.json({ error: 'Invalid ID' }, { status: 400 });
        }

        const list = await prisma.tasklists.findUnique({
            where: { ListID: listId },
            include: {
                projects: true
            }
        });

        if (!list) {
            return NextResponse.json({ error: 'Task list not found' }, { status: 404 });
        }

        return NextResponse.json(list);
    } catch (error) {
        console.error('Error fetching task list:', error);
        return NextResponse.json(
            { error: 'Failed to fetch task list' },
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
        const listId = parseInt(id);
        const body = await request.json();

        if (isNaN(listId)) {
            return NextResponse.json({ error: 'Invalid ID' }, { status: 400 });
        }

        const { ListName, ProjectID } = body;

        const updatedList = await prisma.tasklists.update({
            where: { ListID: listId },
            data: {
                ListName,
                ProjectID: ProjectID ? parseInt(ProjectID) : undefined
            },
        });

        return NextResponse.json(updatedList);
    } catch (error) {
        console.error('Error updating task list:', error);
        return NextResponse.json(
            { error: 'Failed to update task list' },
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
        const listId = parseInt(id);

        if (isNaN(listId)) {
            return NextResponse.json({ error: 'Invalid ID' }, { status: 400 });
        }

        await prisma.tasklists.delete({
            where: { ListID: listId },
        });

        return NextResponse.json({ message: 'Task list deleted successfully' });
    } catch (error) {
        console.error('Error deleting task list:', error);
        return NextResponse.json(
            { error: 'Failed to delete task list' },
            { status: 500 }
        );
    }
}
