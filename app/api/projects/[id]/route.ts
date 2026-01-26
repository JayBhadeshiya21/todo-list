import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

/* =========================
   GET PROJECT BY ID
========================= */
export async function GET(request: Request) {
    const { searchParams } = new URL(request.url);
    const projectId = searchParams.get('projectId');

    if (!projectId) {
        return NextResponse.json(
            { error: 'projectId is required' },
            { status: 400 }
        );
    }

    try {
        const project = await prisma.projects.findUnique({
            where: {
                ProjectID: parseInt(projectId),
            },
            include: {
                users: {
                    select: {
                        UserID: true,
                        UserName: true,
                        Email: true,
                    },
                },
                tasklists: {
                    include: {
                        tasks: true,
                    },
                },
            },
        });

        if (!project) {
            return NextResponse.json(
                { error: 'Project not found' },
                { status: 404 }
            );
        }

        return NextResponse.json(project);
    } catch (error) {
        console.error('Error fetching project:', error);
        return NextResponse.json(
            { error: 'Failed to fetch project' },
            { status: 500 }
        );
    }
}

/* =========================
   UPDATE PROJECT (PUT)
========================= */
export async function PUT(request: Request) {
    const { searchParams } = new URL(request.url);
    const projectId = searchParams.get('projectId');

    if (!projectId) {
        return NextResponse.json(
            { error: 'projectId is required' },
            { status: 400 }
        );
    }

    try {
        const body = await request.json();
        const { ProjectName, Description } = body;

        const updatedProject = await prisma.projects.update({
            where: {
                ProjectID: parseInt(projectId),
            },
            data: {
                ProjectName,
                Description,
            },
        });

        return NextResponse.json(updatedProject);
    } catch (error) {
        console.error('Error updating project:', error);
        return NextResponse.json(
            { error: 'Failed to update project' },
            { status: 500 }
        );
    }
}

/* =========================
   DELETE PROJECT
========================= */
export async function DELETE(request: Request) {
    const { searchParams } = new URL(request.url);
    const projectId = searchParams.get('projectId');

    if (!projectId) {
        return NextResponse.json(
            { error: 'projectId is required' },
            { status: 400 }
        );
    }

    try {
        await prisma.projects.delete({
            where: {
                ProjectID: parseInt(projectId),
            },
        });

        return NextResponse.json(
            { message: 'Project deleted successfully' },
            { status: 200 }
        );
    } catch (error) {
        console.error('Error deleting project:', error);
        return NextResponse.json(
            { error: 'Failed to delete project' },
            { status: 500 }
        );
    }
}
