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
        const { id } = await context.params;   // ✅ MUST await
        const projectId = parseInt(id);

        if (isNaN(projectId)) {
            return NextResponse.json({ error: 'Invalid ID' }, { status: 400 });
        }

        const project = await prisma.projects.findUnique({
            where: { ProjectID: projectId },
            include: { users: { select: { UserName: true } } }
        });

        if (!project) {
            return NextResponse.json({ error: 'Project not found' }, { status: 404 });
        }

        return NextResponse.json(project);

    } catch (error) {
        console.error(error);
        return NextResponse.json({ error: 'Failed to fetch project' }, { status: 500 });
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
        const { id } = await context.params;   // ✅ MUST await
        const projectId = parseInt(id);

        if (isNaN(projectId)) {
            return NextResponse.json({ error: 'Invalid ID' }, { status: 400 });
        }

        const body = await request.json();
        const { ProjectName, Description } = body;

        const updatedProject = await prisma.projects.update({
            where: { ProjectID: projectId },
            data: { ProjectName, Description },
        });

        return NextResponse.json(updatedProject);

    } catch (error) {
        console.error(error);
        return NextResponse.json({ error: 'Failed to update project' }, { status: 500 });
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
        const { id } = await context.params;   // ✅ MUST await
        const projectId = parseInt(id);

        if (isNaN(projectId)) {
            return NextResponse.json({ error: 'Invalid ID' }, { status: 400 });
        }

        await prisma.projects.delete({
            where: { ProjectID: projectId },
        });

        return NextResponse.json({ message: 'Project deleted successfully' });

    } catch (error) {
        console.error(error);
        return NextResponse.json({ error: 'Failed to delete project' }, { status: 500 });
    }
}
