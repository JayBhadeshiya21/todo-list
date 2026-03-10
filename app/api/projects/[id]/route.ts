import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { getCurrentUser, normalizeRole } from '@/lib/auth';

/* ================= GET ================= */
export async function GET(
    request: Request,
    context: { params: Promise<{ id: string }> }
) {
    const user = await getCurrentUser();
    if (!user) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    try {
        const { id } = await context.params;
        const projectId = parseInt(id);

        if (isNaN(projectId)) {
            return NextResponse.json({ error: 'Invalid ID' }, { status: 400 });
        }

        const project = await prisma.projects.findUnique({
            where: { ProjectID: projectId },
            include: { users: { select: { UserName: true, UserID: true } } }
        });

        if (!project) {
            return NextResponse.json({ error: 'Project not found' }, { status: 404 });
        }

        const normalizedRole = normalizeRole(user.userroles[0]?.roles?.RoleName);
        const isUserAdmin = normalizedRole === 'Admin';
        const isUserPM = normalizedRole === 'Project Manager';
        const isUserTM = normalizedRole === 'Team Member';

        if (isUserPM && project.CreatedBy !== user.UserID) {
            return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
        }

        if (isUserTM) {
            // TM can only view if they have a task in it
            const hasTask = await prisma.tasks.findFirst({
                where: {
                    AssignedTo: user.UserID,
                    tasklists: { ProjectID: projectId }
                }
            });
            if (!hasTask) {
                return NextResponse.json({ error: 'Forbidden: You are not assigned to this project' }, { status: 403 });
            }
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
    const user = await getCurrentUser();
    if (!user) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    try {
        const { id } = await context.params;
        const projectId = parseInt(id);

        if (isNaN(projectId)) {
            return NextResponse.json({ error: 'Invalid ID' }, { status: 400 });
        }

        const project = await prisma.projects.findUnique({
            where: { ProjectID: projectId }
        });

        if (!project) {
            return NextResponse.json({ error: 'Project not found' }, { status: 404 });
        }

        const normalizedRole = normalizeRole(user.userroles[0]?.roles?.RoleName);
        const isUserAdmin = normalizedRole === 'Admin';
        const isUserPM = normalizedRole === 'Project Manager';

        if (!isUserAdmin && !(isUserPM && project.CreatedBy === user.UserID)) {
            return NextResponse.json({ error: 'Forbidden: Edit restricted to Admin or Project Creator' }, { status: 403 });
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
    const user = await getCurrentUser();
    if (!user) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const normalizedRole = normalizeRole(user.userroles[0]?.roles?.RoleName);
    if (normalizedRole !== 'Admin') {
        return NextResponse.json({ error: 'Forbidden: Delete restricted to Admin only' }, { status: 403 });
    }

    try {
        const { id } = await context.params;
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
