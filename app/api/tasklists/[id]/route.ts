import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

export async function GET(
    request: Request,
    { params }: { params: { id: string } }
) {
    try {
        const id = parseInt(params.id);
        const list = await prisma.tasklists.findUnique({
            where: { ListID: id },
            include: { projects: { select: { ProjectName: true } } }
        });

        if (!list) {
            return NextResponse.json({ error: 'Task list not found' }, { status: 404 });
        }

        return NextResponse.json(list);
    } catch (error) {
        return NextResponse.json({ error: 'Failed to fetch task list' }, { status: 500 });
    }
}

export async function PUT(
    request: Request,
    { params }: { params: { id: string } }
) {
    try {
        const id = parseInt(params.id);
        const body = await request.json();
        const { ListName, ProjectID } = body;

        const updatedList = await prisma.tasklists.update({
            where: { ListID: id },
            data: {
                ListName,
                ProjectID: ProjectID ? parseInt(ProjectID) : undefined
            },
        });

        return NextResponse.json(updatedList);
    } catch (error) {
        return NextResponse.json({ error: 'Failed to update task list' }, { status: 500 });
    }
}

export async function DELETE(
    request: Request,
    { params }: { params: { id: string } }
) {
    try {
        const id = parseInt(params.id);
        await prisma.tasklists.delete({
            where: { ListID: id },
        });

        return NextResponse.json({ message: 'Task list deleted successfully' });
    } catch (error) {
        return NextResponse.json({ error: 'Failed to delete task list' }, { status: 500 });
    }
}
