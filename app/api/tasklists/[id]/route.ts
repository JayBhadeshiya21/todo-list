import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { cookies } from 'next/headers';

async function checkAdmin() {
    const cookieStore = await cookies();
    const adminId = cookieStore.get('adminId');
    return !!adminId;
}

/* ================= GET ================= */
export async function GET(
    request: Request,
    context: { params: Promise<{ id: string }> }
) {
    if (!(await checkAdmin())) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    try {
        const { id } = await context.params;   // ✅ await here
        const listId = parseInt(id);

        if (isNaN(listId)) {
            return NextResponse.json({ error: 'Invalid ID' }, { status: 400 });
        }

        const list = await prisma.tasklists.findUnique({
            where: { ListID: listId },
            include: { projects: { select: { ProjectName: true } } }
        });

        if (!list) {
            return NextResponse.json({ error: 'Task list not found' }, { status: 404 });
        }

        return NextResponse.json(list);

    } catch (error) {
        console.error(error);
        return NextResponse.json({ error: 'Failed to fetch task list' }, { status: 500 });
    }
}

/* ================= PUT ================= */
export async function PUT(
    request: Request,
    context: { params: Promise<{ id: string }> }
) {
    if (!(await checkAdmin())) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    try {
        const { id } = await context.params;   // ✅ await here
        const listId = parseInt(id);

        if (isNaN(listId)) {
            return NextResponse.json({ error: 'Invalid ID' }, { status: 400 });
        }

        const body = await request.json();
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
        console.error(error);
        return NextResponse.json({ error: 'Failed to update task list' }, { status: 500 });
    }
}

/* ================= DELETE ================= */
export async function DELETE(
    request: Request,
    context: { params: Promise<{ id: string }> }
) {
    if (!(await checkAdmin())) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    try {
        const { id } = await context.params;   // ✅ await here
        const listId = parseInt(id);

        if (isNaN(listId)) {
            return NextResponse.json({ error: 'Invalid ID' }, { status: 400 });
        }

        await prisma.tasklists.delete({
            where: { ListID: listId },
        });

        return NextResponse.json({ message: 'Task list deleted successfully' });

    } catch (error) {
        console.error(error);
        return NextResponse.json({ error: 'Failed to delete task list' }, { status: 500 });
    }
}
