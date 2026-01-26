import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

export async function GET(request: Request) {
    const { searchParams } = new URL(request.url);
    const projectId = searchParams.get('projectId');

    try {
        let whereClause: any = {};
        if (projectId) {
            whereClause.ProjectID = parseInt(projectId);
        }

        const lists = await prisma.tasklists.findMany({
            where: whereClause,
            include: {
                projects: true // Include project info
            }
        });
        return NextResponse.json(lists);
    } catch (error) {
        console.error('Error fetching task lists:', error);
        return NextResponse.json(
            { error: 'Failed to fetch task lists' },
            { status: 500 }
        );
    }
}

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const { ProjectID, ListName } = body;

        if (!ProjectID || !ListName) {
            return NextResponse.json(
                { error: 'ProjectID and ListName are required' },
                { status: 400 }
            );
        }

        const newList = await prisma.tasklists.create({
            data: {
                ProjectID: parseInt(ProjectID),
                ListName,
            },
        });

        return NextResponse.json(newList, { status: 201 });
    } catch (error) {
        console.error('Error creating task list:', error);
        return NextResponse.json(
            { error: 'Failed to create task list' },
            { status: 500 }
        );
    }
}
